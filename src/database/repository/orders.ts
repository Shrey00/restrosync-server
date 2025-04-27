import db from "../connection";
import { inArray, sql, or, and } from "drizzle-orm";
import { restaurants } from "../drizzle/schema/restaurants_schema";
import { orders } from "../drizzle/schema/orders_schema";
import { orderItems } from "../drizzle/schema/order_items_schema";
import { address } from "../drizzle/schema/address_schema";
import { users } from "../drizzle/schema/users_schema";
import { menu } from "../drizzle/schema/menu_schema";
import { offers } from "../drizzle/schema/offers_schema";
import { cart } from "../drizzle/schema/cart_schema";
import { orderItems as orderItemsTable } from "../drizzle/schema/order_items_schema";
import {
  generateOrderId,
  getTimestampPlusOneHour,
} from "../../utils/generateOrderId";
import { AppError } from "../../utils/ErrorHandler";

type OrderItemRowDataType = {
  orderId: string;
  status: string;
  orderItem: string;
  quantity: number;
  amount: number;
}[];
export class OrdersRepository {
  //@TODO: fetch addons data from DB for price verification.
  async createOrder(params: any) {
    const {
      userId,
      orderItems,
      scheduledOrder,
      address,
      paymentMethod,
      appliedCoupon,
      taxes,
    } = params;
    try {
      const deliveryCharges = 0;
      const orderItemIdArr: string[] = [];
      let totalAmount = 0;
      let discountAmount = 0;
      //order items array
      orderItems.forEach((item: any, index: number) => {
        orderItemIdArr.push(item.menuId);
      });
      const response = await db.transaction(async (txn) => {
        // Step - 1 get pricing info from menu table
        const orderItemsData = await txn
          .select({
            menuId: menu.id,
            sellingPrice: menu.sellingPrice,
            quantity: cart.quantity,
          })
          .from(menu)
          .where(inArray(menu.id, orderItemIdArr))
          .innerJoin(cart, sql`${cart.menuItemId}=${menu.id}`);

        totalAmount = orderItemsData.reduce(
          (acc: number, item: any, index: number) => {
            if (orderItems[index].addOns) {
              const addOnsTotal = orderItems[index].addOns.reduce(
                (acc: number, addOn: any) => {
                  return acc + addOn.sellingPrice;
                },
                0
              );
              return acc + (item.sellingPrice + addOnsTotal) * item.quantity;
            }
            return acc + item.sellingPrice * item.quantity;
          },
          0
        );
        //Step 1.1 - Check if coupon is applied, if it is, calculate the total amount based on coupon.
        if (appliedCoupon) {
          const couponDetails = await txn
            .select({
              discount: offers.discount,
              freeItem: offers.freeItem,
              startTime: offers.startTime,
              endTime: offers.endTime,
              maxDiscountAmount: offers.maxDiscountAmount,
              minOrderValue: offers.minOrderValue,
              maxUsage: offers.maxUsage,
              usage: offers.usage,
              couponCode: offers.couponCode,
            })
            .from(offers)
            .leftJoin(menu, sql`${appliedCoupon.freeItem}=${menu.id}`)
            .where(
              and(
                sql`${offers.couponCode}=${appliedCoupon.couponCode}`,
                sql`${offers.startTime} < NOW()`,
                sql`${offers.endTime} > NOW()`
              )
            );
          if (
            couponDetails.length &&
            totalAmount >= couponDetails[0].minOrderValue
          ) {
            discountAmount = (totalAmount * couponDetails[0].discount) / 100;
            if (discountAmount <= couponDetails[0].maxDiscountAmount) {
              totalAmount = totalAmount - discountAmount;
            } else if (discountAmount > couponDetails[0].maxDiscountAmount) {
              totalAmount = totalAmount - couponDetails[0].maxDiscountAmount;
            }
          }
        }
        // Step 2: Insert into orders table,
        const orderDetails = await txn
          .insert(orders)
          .values({
            orderId: generateOrderId(),
            customerId: userId,
            taxes: 0,
            deliveryCharges: 0,
            deliveryStatus: "Confirmed",
            totalAmount: totalAmount,
            paymentMethod: paymentMethod,
            paymentStatus: paymentMethod === "COD" ? "Pending" : "Created",
            scheduledAt: getTimestampPlusOneHour(),
            discount: discountAmount,
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
        const orderItemsDataClean = [...orderItemsData];
        const orderItemsDetailsArr: any[] = [];
        if (orderItemsDataClean.length > 0)
          orderItemsDataClean.forEach((item, index) => {
            orderItemsDetailsArr.push({
              orderId: orderDetails[0].id,
              status: "Pending",
              orderItem: item.menuId,
              quantity: item.quantity,
              amount: item.sellingPrice! * item.quantity,
              addOns: orderItems[index].addOns
                ? orderItems[index].addOns
                : null,
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
  async getOrdersByRestaurant(params: {
    restaurantId: string;
    queryParams: any;
  }) {
    try {
      const conditions = [];
      if (params.queryParams.search) {
        conditions.push(
          or(
            sql`${users.firstName} ILIKE ${
              "%" + params.queryParams.search + "%"
            }`,
            sql`${users.lastName} ILIKE ${
              "%" + params.queryParams.search + "%"
            }`,
            sql`${orders.orderId} ILIKE ${
              "%" + params.queryParams.search + "%"
            }`
          )
        );
      }
      if (params.queryParams.orderStatus) {
        conditions.push(
          sql`${orders.deliveryStatus}=${params.queryParams.orderStatus}`
        );
      }
      if (params.queryParams.paymentStatus) {
        conditions.push(
          sql`${orders.paymentStatus}=${params.queryParams.paymentStatus}`
        );
      }
      if (params.queryParams.paymentMethod) {
        conditions.push(
          sql`${orders.paymentMethod}=${params.queryParams.paymentMethod}`
        );
      }
      const totalOrdersByRestaurant = await db
        .select({
          id: orders.id,
          orderId: orders.orderId,
          paymentMethod: orders.paymentMethod,
          paymentStatus: orders.paymentStatus,
          scheduledOrder: orders.scheduledOrder,
          scheduledAt: orders.scheduledAt,
          totalAmount: orders.totalAmount,
          taxes: orders.taxes,
          deliveryCharges: orders.deliveryCharges,
          deliveryStatus: orders.deliveryStatus,
          customerFirstName: users.firstName,
          customerLastName: users.lastName,
          customerCountryCode: users.countryCode,
          customerContact: users.contact,
          customerEmail: users.email,
          address: {
            address_line_1: address.address_line_1,
            address_line_2: address.address_line_2,
            city: address.city,
            postalCode: address.postalCode,
            location: address.location,
          },
        })
        .from(orders)
        .innerJoin(users, sql`${orders.customerId}=${users.id}`)
        .innerJoin(address, sql`${orders.address}=${address.id}`)
        .orderBy(sql`${orders.createdAt} desc`)
        .where(and(...conditions));
      console.log(totalOrdersByRestaurant);
      return totalOrdersByRestaurant;
    } catch (e) {
      if (e instanceof Error)
        throw new AppError(500, e?.message, "DB error", true);
    }
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
      .where(sql`${orders.orderId}=${params.orderId}`);
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
      .where(
        sql`${orders.customerId}=${params.userId} AND ${orders.deliveryStatus}!='Confirmed' AND ${orders.deliveryStatus}!='Cancelled'`
      )
      .groupBy(
        orders.orderId,
        orders.totalAmount,
        restaurants.name,
        orders.createdAt,
        orders.deliveryStatus
      );
    return pendingOrderItems;
  }
  async getOrderItems(params: { orderId: string }) {
    const response = await db
      .select({
        id: orderItems.id,
        name: menu.name,
        status: orderItems.status,
        images: menu.images,
        available: menu.available,
        cuisineType: menu.cuisineType,
        amount: orderItems.amount,
        quantity: orderItems.quantity,
        addOns: orderItems.addOns,
      })
      .from(orderItems)
      .innerJoin(menu, sql`${orderItems.orderItem}=${menu.id}`)
      .where(sql`${orderItems.orderId}=${params.orderId}`);
    return response;
  }
  async setOrderItemStatus(params: {
    orderItemId: string;
    status: "Pending" | "Ready" | "Cancelled";
  }) {
    const response = await db
      .update(orderItems)
      .set({
        status: params.status,
      })
      .where(sql`${orderItems.orderId}=${params.orderItemId}`)
      .returning({
        status: orderItems.status,
      });
    return response;
  }
}
