import db from "../connection";
import { eq, inArray, sql } from "drizzle-orm";
import { RestaurantRequestBody } from "../../types";
import { restaurants } from "../drizzle/schema/restaurants_schema";
import { orders } from "../drizzle/schema/orders_schema";
import { orderItems } from "../drizzle/schema/order_items_schema";
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
      console.log("This is item");
      console.log(orderItems);
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
            deliveryStatus: "Confirmed",
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
        console.log("DEBUG BRO");
        console.log(JSON.stringify(orderItemsData, null, 2));
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
  async getOrdersByUser(params: { userId: string }) {
    const myOrderItemsList = await db
      .select({
        orderId: orders.orderId,
        totalAmount: orders.totalAmount,
        restaurantName: restaurants.name,
        deliveryStatus: orders.deliveryStatus,
        createdAt: orders.createdAt,
        orderItems: sql`json_agg(json_build_object(
          'name', ${menu.name},
          'cuisineType', ${menu.cuisineType},
          'status', ${orderItems.status},
          'quantity', ${orderItems.quantity},
          'amount', ${orderItems.amount}
        ))`,
      })
      .from(orderItems)
      .innerJoin(menu, sql`${orderItems.orderItem}=${menu.id}`)
      .innerJoin(orders, sql`${orderItems.orderId}=${orders.id}`)
      .innerJoin(restaurants, sql`${menu.restaurantId}=${restaurants.id}`)
      .where(sql`${orders.customerId}=${params.userId}`)
      .groupBy(
        orders.orderId,
        orders.totalAmount,
        restaurants.name,
        orders.createdAt,
        orders.deliveryStatus
      );
    return myOrderItemsList;
  }
  async updateOrderStatus(params: {
    orderId: string;
    orderStatus:
      | "Confirmed"
      | "Preparing"
      | "Ready"
      | "Picked"
      | "Enroute"
      | "Delivered"
      | "Cancelled"
      | null
      | undefined;
  }) {
    const { orderStatus } = params;
    const response = await db
      .update(orders)
      .set({ deliveryStatus: orderStatus })
      .where(sql`${orders.id}=${params.orderId}`);
    return response;
  }
  async getPendingOrderDetails(params: { userId: string }) {
    const pendingOrderItems = await db
    .select({
      orderId: orders.orderId,
      totalAmount: orders.totalAmount,
      restaurantName: restaurants.name,
      deliveryStatus: orders.deliveryStatus,
      createdAt: orders.createdAt,
      orderItems: sql`json_agg(json_build_object(
        'name', ${menu.name},
        'cuisineType', ${menu.cuisineType},
        'status', ${orderItems.status},
        'quantity', ${orderItems.quantity},
        'amount', ${orderItems.amount}
      ))`,
    })
    .from(orderItems)
    .innerJoin(menu, sql`${orderItems.orderItem}=${menu.id}`)
    .innerJoin(orders, sql`${orderItems.orderId}=${orders.id}`)
    .innerJoin(restaurants, sql`${menu.restaurantId}=${restaurants.id}`)
    .where(sql`${orders.customerId}=${params.userId} AND ${orders.deliveryStatus}!='Confirmed' AND ${orders.deliveryStatus}!='Cancelled'`)
    .groupBy(
      orders.orderId,
      orders.totalAmount,
      restaurants.name,
      orders.createdAt,
      orders.deliveryStatus
    );
    return pendingOrderItems;
  }
  async getOrderStatus(params: { orderId: string }) {
    const response = await db
      .select({ orderStatus: orders.deliveryStatus })
      .from(orders)
      .where(sql`${orders.orderId}=${params.orderId}`);
    return response;
  }
}
