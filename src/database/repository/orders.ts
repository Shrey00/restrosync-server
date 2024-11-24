import db from "../connection";
import { eq, inArray, sql } from "drizzle-orm";
import { RestaurantRequestBody } from "../../types";
import { restaurants } from "../drizzle/schema/restaurants_schema";
import { orders } from "../drizzle/schema/orders_schema";
import { menu } from "../drizzle/schema/menu_schema";
import { cart } from "../drizzle/schema/cart_schema";
import { orderItems as orderItemsTable } from "../drizzle/schema/order_items_schema";
import { AddressType } from "../../types";
import { relationUsersRestaurants } from "../drizzle/schema/user_restaurant_relation_schema";
import { restaurantUpload } from "../../api/middlewares/storage";
import { AppError, handler } from "../../utils/ErrorHandler";
import {
  generateOrderId,
  getTimestampPlusOneHour,
} from "../../utils/generateOrderId";
type OrderItemsData = {
  items: {
    menuId: string;
    amount: number;
    quantity: number;
  }[];
  totalPrice: number;
}[];

type OrderItemRowDataType = {
  orderId: string;
  status: string;
  orderItem: string;
  quantity: number;
  amount: number;
}[];
export class OrdersRepository {
  async createOrder(params: any) {
    const {
      userId,
      orderItems,
      scheduledOrder,
      address,
      paymentMethod,
      taxes,
    } = params;
    try {
      const deliveryCharges = 0;
      const orderItemIdArr: string[] = [];
      orderItems.forEach((item: any, index: number) => {
        orderItemIdArr.push(item.menuId);
      });
      const response = await db.transaction(async (txn) => {
        // Step 1: Insert into orders table
        const orderItemsData = await txn
          .select({
            items: sql`json_agg(json_build_object('menuId',${menu.id},
                                                  'amount',${menu.sellingPrice} * ${cart.quantity},
                                                  'quantity',${cart.quantity}))`,
            totalPrice: sql`SUM(${menu.sellingPrice} * ${cart.quantity})`,
          })
          .from(menu)
          .where(inArray(menu.id, orderItemIdArr))
          .innerJoin(cart, sql`${cart.menuItemId}=${menu.id}`);
        const orderDetails = await txn
          .insert(orders)
          .values({
            orderId: generateOrderId(),
            customerId: userId,
            taxes: 0,
            deliveryCharges: 0,
            totalAmount: orderItemsData[0].totalPrice,
            paymentMethod: paymentMethod,
            paymentStatus: paymentMethod === "COD" ? "Pending" : "Created",
            scheduledAt: getTimestampPlusOneHour(),
            address: address,
          } as any)
          .returning({
            id: orders.id,
            orderId: orders.orderId,
            customerId: orders.customerId,
            taxes: orders.taxes,
            deliveryCharges: orders.deliveryCharges,
            totalAmount: orders.totalAmount,
            paymentMethod: orders.paymentMethod,
            paymentStatus: orders.paymentStatus,
            scheduledAt: orders.scheduledAt,
            address: orders.address,
          });

        const orderItemsDataClean = [...orderItemsData] as OrderItemsData;
        const orderItemsDetailsArr: any[] = [];
        if (orderItemsDataClean[0].items.length > 0)
          orderItemsDataClean[0].items.forEach((item) => {
            orderItemsDetailsArr.push({
              orderId: orderDetails[0].id,
              status: "Pending",
              orderItem: item.menuId,
              quantity: item.quantity,
              amount: item.amount,
            });
          });
        await txn.insert(orderItemsTable).values(orderItemsDetailsArr as any[]);
        return orderDetails;
      });
      return response;
    } catch (e) {
      console.log(e);
    }
  }
}
