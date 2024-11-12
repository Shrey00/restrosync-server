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
exports.CartRepository = void 0;
const connection_1 = __importDefault(require("../connection"));
const drizzle_orm_1 = require("drizzle-orm");
const menu_schema_1 = require("../drizzle/schema/menu_schema");
const ErrorHandler_1 = require("../../utils/ErrorHandler");
const cart_schema_1 = require("../drizzle/schema/cart_schema");
class CartRepository {
    findCartItems(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield connection_1.default
                    .select({
                    id: cart_schema_1.cart.id,
                    name: menu_schema_1.menu.name,
                    quantity: cart_schema_1.cart.quantity,
                    sellingPrice: cart_schema_1.cart.finalPrice,
                    cuisineType: menu_schema_1.menu.cuisineType,
                    markedPrice: menu_schema_1.menu.markedPrice,
                    discount: menu_schema_1.menu.discount,
                })
                    .from(cart_schema_1.cart)
                    .innerJoin(menu_schema_1.menu, (0, drizzle_orm_1.sql) `${cart_schema_1.cart.itemId}=${menu_schema_1.menu.id}`)
                    .where((0, drizzle_orm_1.sql) `${cart_schema_1.cart.userId}=${params.userId}`);
                return response;
            }
            catch (e) {
                if (e instanceof Error)
                    throw new ErrorHandler_1.AppError(500, e === null || e === void 0 ? void 0 : e.message, "DB error", false);
            }
        });
    }
    insertCartItem(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield connection_1.default.transaction((txn) => __awaiter(this, void 0, void 0, function* () {
                    const itemPrice = yield txn
                        .select({ sellingPrice: menu_schema_1.menu.sellingPrice })
                        .from(menu_schema_1.menu)
                        .where((0, drizzle_orm_1.sql) `${menu_schema_1.menu.id}=${params.itemId}`);
                    const insertCartItem = yield txn
                        .insert(cart_schema_1.cart)
                        .values({
                        userId: params.userId,
                        itemId: params.itemId,
                        quantity: params.quantity,
                        finalPrice: itemPrice[0].sellingPrice
                            ? itemPrice[0].sellingPrice * params.quantity
                            : itemPrice[0].sellingPrice,
                    })
                        .returning({
                        id: cart_schema_1.cart.id,
                        userId: cart_schema_1.cart.userId,
                        itemId: cart_schema_1.cart.itemId,
                        quantity: cart_schema_1.cart.quantity,
                        finalPrice: cart_schema_1.cart.finalPrice,
                    });
                    return insertCartItem;
                }));
                return response;
            }
            catch (e) {
                if (e instanceof Error)
                    throw new ErrorHandler_1.AppError(500, e === null || e === void 0 ? void 0 : e.message, "DB error", false);
            }
        });
    }
}
exports.CartRepository = CartRepository;
//# sourceMappingURL=cart.js.map