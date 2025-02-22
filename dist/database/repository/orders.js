"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersRepository = void 0;
const connection_1 = __importDefault(require("../connection"));
const drizzle_orm_1 = require("drizzle-orm");
const restaurants_schema_1 = require("../drizzle/schema/restaurants_schema");
const orders_schema_1 = require("../drizzle/schema/orders_schema");
const order_items_schema_1 = require("../drizzle/schema/order_items_schema");
const menu_schema_1 = require("../drizzle/schema/menu_schema");
const cart_schema_1 = require("../drizzle/schema/cart_schema");
const order_items_schema_2 = require("../drizzle/schema/order_items_schema");
const generateOrderId_1 = require("../../utils/generateOrderId");
class OrdersRepository {
    createOrder(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, orderItems, scheduledOrder, address, paymentMethod, taxes, } = params;
            try {
                const deliveryCharges = 0;
                const orderItemIdArr = [];
                orderItems.forEach((item, index) => {
                    orderItemIdArr.push(item.menuId);
                });
                console.log("This is item");
                console.log(orderItems);
                const response = yield connection_1.default.transaction((txn) => __awaiter(this, void 0, void 0, function* () {
                    // Step 1: Insert into orders table
                    const orderItemsData = yield txn
                        .select({
                        items: (0, drizzle_orm_1.sql) `json_agg(json_build_object('menuId',${menu_schema_1.menu.id},
                                                  'amount',${menu_schema_1.menu.sellingPrice} * ${cart_schema_1.cart.quantity},
                                                  'quantity',${cart_schema_1.cart.quantity}))`,
                        totalPrice: (0, drizzle_orm_1.sql) `SUM(${menu_schema_1.menu.sellingPrice} * ${cart_schema_1.cart.quantity})`,
                    })
                        .from(menu_schema_1.menu)
                        .where((0, drizzle_orm_1.inArray)(menu_schema_1.menu.id, orderItemIdArr))
                        .innerJoin(cart_schema_1.cart, (0, drizzle_orm_1.sql) `${cart_schema_1.cart.menuItemId}=${menu_schema_1.menu.id}`);
                    const orderDetails = yield txn
                        .insert(orders_schema_1.orders)
                        .values({
                        orderId: (0, generateOrderId_1.generateOrderId)(),
                        customerId: userId,
                        taxes: 0,
                        deliveryCharges: 0,
                        deliveryStatus: "Confirmed",
                        totalAmount: orderItemsData[0].totalPrice,
                        paymentMethod: paymentMethod,
                        paymentStatus: paymentMethod === "COD" ? "Pending" : "Created",
                        scheduledAt: (0, generateOrderId_1.getTimestampPlusOneHour)(),
                        address: address,
                    })
                        .returning({
                        id: orders_schema_1.orders.id,
                        orderId: orders_schema_1.orders.orderId,
                        customerId: orders_schema_1.orders.customerId,
                        taxes: orders_schema_1.orders.taxes,
                        deliveryCharges: orders_schema_1.orders.deliveryCharges,
                        totalAmount: orders_schema_1.orders.totalAmount,
                        paymentMethod: orders_schema_1.orders.paymentMethod,
                        paymentStatus: orders_schema_1.orders.paymentStatus,
                        scheduledAt: orders_schema_1.orders.scheduledAt,
                        address: orders_schema_1.orders.address,
                    });
                    console.log("DEBUG BRO");
                    console.log(JSON.stringify(orderItemsData, null, 2));
                    const orderItemsDataClean = [...orderItemsData];
                    const orderItemsDetailsArr = [];
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
                    yield txn.insert(order_items_schema_2.orderItems).values(orderItemsDetailsArr);
                    return orderDetails;
                }));
                return response;
            }
            catch (e) {
                console.log(e);
            }
        });
    }
    getOrdersByUser(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const myOrderItemsList = yield connection_1.default
                .select({
                orderId: orders_schema_1.orders.orderId,
                totalAmount: orders_schema_1.orders.totalAmount,
                restaurantName: restaurants_schema_1.restaurants.name,
                deliveryStatus: orders_schema_1.orders.deliveryStatus,
                createdAt: orders_schema_1.orders.createdAt,
                orderItems: (0, drizzle_orm_1.sql) `json_agg(json_build_object(
          'name', ${menu_schema_1.menu.name},
          'cuisineType', ${menu_schema_1.menu.cuisineType},
          'status', ${order_items_schema_1.orderItems.status},
          'quantity', ${order_items_schema_1.orderItems.quantity},
          'amount', ${order_items_schema_1.orderItems.amount}
        ))`,
            })
                .from(order_items_schema_1.orderItems)
                .innerJoin(menu_schema_1.menu, (0, drizzle_orm_1.sql) `${order_items_schema_1.orderItems.orderItem}=${menu_schema_1.menu.id}`)
                .innerJoin(orders_schema_1.orders, (0, drizzle_orm_1.sql) `${order_items_schema_1.orderItems.orderId}=${orders_schema_1.orders.id}`)
                .innerJoin(restaurants_schema_1.restaurants, (0, drizzle_orm_1.sql) `${menu_schema_1.menu.restaurantId}=${restaurants_schema_1.restaurants.id}`)
                .where((0, drizzle_orm_1.sql) `${orders_schema_1.orders.customerId}=${params.userId}`)
                .groupBy(orders_schema_1.orders.orderId, orders_schema_1.orders.totalAmount, restaurants_schema_1.restaurants.name, orders_schema_1.orders.createdAt, orders_schema_1.orders.deliveryStatus);
            return myOrderItemsList;
        });
    }
    updateOrderStatus(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { orderStatus } = params;
            const response = yield connection_1.default
                .update(orders_schema_1.orders)
                .set({ deliveryStatus: orderStatus })
                .where((0, drizzle_orm_1.sql) `${orders_schema_1.orders.id}=${params.orderId}`);
            return response;
        });
    }
    getPendingOrderDetails(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const pendingOrderItems = yield connection_1.default
                .select({
                orderId: orders_schema_1.orders.orderId,
                totalAmount: orders_schema_1.orders.totalAmount,
                restaurantName: restaurants_schema_1.restaurants.name,
                deliveryStatus: orders_schema_1.orders.deliveryStatus,
                createdAt: orders_schema_1.orders.createdAt,
                orderItems: (0, drizzle_orm_1.sql) `json_agg(json_build_object(
        'name', ${menu_schema_1.menu.name},
        'cuisineType', ${menu_schema_1.menu.cuisineType},
        'status', ${order_items_schema_1.orderItems.status},
        'quantity', ${order_items_schema_1.orderItems.quantity},
        'amount', ${order_items_schema_1.orderItems.amount}
      ))`,
            })
                .from(order_items_schema_1.orderItems)
                .innerJoin(menu_schema_1.menu, (0, drizzle_orm_1.sql) `${order_items_schema_1.orderItems.orderItem}=${menu_schema_1.menu.id}`)
                .innerJoin(orders_schema_1.orders, (0, drizzle_orm_1.sql) `${order_items_schema_1.orderItems.orderId}=${orders_schema_1.orders.id}`)
                .innerJoin(restaurants_schema_1.restaurants, (0, drizzle_orm_1.sql) `${menu_schema_1.menu.restaurantId}=${restaurants_schema_1.restaurants.id}`)
                .where((0, drizzle_orm_1.sql) `${orders_schema_1.orders.customerId}=${params.userId} AND ${orders_schema_1.orders.deliveryStatus}!='Confirmed' AND ${orders_schema_1.orders.deliveryStatus}!='Cancelled'`)
                .groupBy(orders_schema_1.orders.orderId, orders_schema_1.orders.totalAmount, restaurants_schema_1.restaurants.name, orders_schema_1.orders.createdAt, orders_schema_1.orders.deliveryStatus);
            return pendingOrderItems;
        });
    }
    getOrderStatus(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield connection_1.default
                .select({ orderStatus: orders_schema_1.orders.deliveryStatus })
                .from(orders_schema_1.orders)
                .where((0, drizzle_orm_1.sql) `${orders_schema_1.orders.orderId}=${params.orderId}`);
            return response;
        });
    }
}
exports.OrdersRepository = OrdersRepository;
//# sourceMappingURL=orders.js.map