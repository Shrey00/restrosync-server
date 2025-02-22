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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cart = void 0;
const repository_1 = require("../database/repository");
class Cart {
    constructor() {
        this.repository = new repository_1.CartRepository();
    }
    postCartItem(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, menuItemId, restaurantId } = params;
            const quantity = 1;
            const response = yield this.repository.insertCartItem({
                menuItemId,
                userId,
                quantity,
                restaurantId,
            });
            return response;
        });
    }
    getCartItems(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.repository.findCartItems(params);
            return response;
        });
    }
    patchQuantity(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.repository.updateQuantity(params);
            return response;
        });
    }
    deleteCartItem(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.repository.deleteCartItem(params);
            return response;
        });
    }
    deleteAllCartItems(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.repository.deleteAllCartItems(params);
            return response;
        });
    }
}
exports.Cart = Cart;
//# sourceMappingURL=cart.js.map