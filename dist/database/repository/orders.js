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
const menu_schema_1 = require("../drizzle/schema/menu_schema");
class OrdersRepository {
    createOrder(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, order_items, scheduledOrder, addressId, restaurantId } = params;
            try {
                const orderItemIdArr = [];
                order_items.forEach((item, index) => {
                    orderItemIdArr.push(item.id);
                });
                const response = yield connection_1.default.transaction((txn) => __awaiter(this, void 0, void 0, function* () {
                    // Step 1: Insert into orders table
                    const orderItemPrices = yield txn
                        .select({
                        items: (0, drizzle_orm_1.sql) `array_agg(${menu_schema_1.menu.sellingPrice})`,
                        totalPrice: (0, drizzle_orm_1.sql) `SUM(${menu_schema_1.menu.sellingPrice})`,
                    })
                        .from(menu_schema_1.menu)
                        .where((0, drizzle_orm_1.inArray)(menu_schema_1.menu.id, orderItemIdArr));
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
                }));
                return response;
            }
            catch (e) {
                console.log(e);
            }
        });
    }
}
exports.OrdersRepository = OrdersRepository;
//# sourceMappingURL=orders.js.map