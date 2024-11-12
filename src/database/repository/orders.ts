import db from "../connection";
import { eq, inArray, sql } from "drizzle-orm";
import { RestaurantRequestBody } from "../../types";
import { restaurants } from "../drizzle/schema/restaurants_schema";
import { address } from "../drizzle/schema/address_schema";
import { orders } from "../drizzle/schema/orders_schema";
import { menu } from "../drizzle/schema/menu_schema";
import { orderItems } from "../drizzle/schema/order_items_schema";
import { AddressType } from "../../types";
import { relationUsersRestaurants } from "../drizzle/schema/user_restaurant_relation_schema";
import { restaurantUpload } from "../../api/middlewares/storage";
import { AppError, handler } from "../../utils/ErrorHandler";

export class OrdersRepository {
  async createOrder(params: any) {
    const { userId, order_items, scheduledOrder, addressId, restaurantId } =
      params;
    try {
      const orderItemIdArr: string[] = [];
      order_items.forEach((item: any, index: number) => {
        orderItemIdArr.push(item.id);
      });
      const response = await db.transaction(async (txn) => {
        // Step 1: Insert into orders table

        const orderItemPrices = await txn
          .select({
            items: sql`array_agg(${menu.sellingPrice})`,
            totalPrice: sql`SUM(${menu.sellingPrice})`,
          })
          .from(menu)
          .where(inArray(menu.id, orderItemIdArr));
       
        // const [newOrder] = await txn
        //   .insert(orders)
        //   .values({

        //     customerId: userId,
        //     status: "pending",
        //     totalAmount: orderItemPrices[0].totalPrice,
        //     paymentMethod: "COD",
        //     paymentStatus: "Created",
        //     scheduledOrder,
        //     address: addressId,
        //   } as any)
        //   .returning();

        // Step 2: Insert into order_items table
        //fetch the original price from the menu
        //also if coupon code applied, fetch the of/////////+-fer detail and discount as per the coupon.
        // calculate the final price of item

        // await txn.insert(orderItems).values(
        //   order_items.map((item: any,index: number) => ({
        //     orderId: newOrder.id,
        //     customerId: userId,
        //     restaurantId: restaurantId,
        //     status: "Pending",
        //     orderItem: orderItemPrices[0],
        //     quantity: item.quantity,
        //     amount: item.finalPrice,
        //     addNote: item.addNote,
        //   }))
      });
      return response;
    } catch (e) {
      console.log(e);
    }
  }
}
