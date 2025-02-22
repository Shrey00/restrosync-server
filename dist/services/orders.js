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
exports.Orders = void 0;
const orders_1 = require("../database/repository/orders");
class Orders {
    constructor() {
        this.repository = new orders_1.OrdersRepository();
    }
    postOrder(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.repository.createOrder(params);
            return response;
        });
    }
    getOrdersByUser(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.repository.getOrdersByUser(params);
            return response;
        });
    }
    updateOrderStatus(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.repository.updateOrderStatus(params);
            return response;
        });
    }
    getPendingOrderDetails(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.repository.getPendingOrderDetails(params);
            return response;
        });
    }
    getOrderStatus(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.repository.getOrderStatus(params);
            return response;
        });
    }
}
exports.Orders = Orders;
//# sourceMappingURL=orders.js.map