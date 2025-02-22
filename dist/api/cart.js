"use strict";
//get the menu of a restaurant
//add or delete item from a restaurant -> priviledge: Admin
//update menu item ->priviledge: Admin
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
const express_1 = require("express");
const express_2 = require("express");
const services_1 = require("../services");
const auth_1 = require("./middlewares/auth");
const formatResponse_1 = __importDefault(require("../utils/formatResponse"));
const app = (0, express_2.Router)();
const cart = new services_1.Cart();
app.post("/add-to-cart", auth_1.auth, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { menuItemId } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const response = yield cart.postCartItem({ menuItemId, userId });
        res.status(200).json(response);
    }
    catch (e) {
        next(e);
    }
}));
app.get("/get-cart-items", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const response = yield cart.getCartItems(Object.assign(Object.assign({}, req.body), { userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id }));
    const formattedResponse = (0, formatResponse_1.default)(req.newToken, response);
    res.status(200).json(formattedResponse);
}));
app.patch("/update-quantity", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield cart.patchQuantity({
        itemId: req.body.itemId,
        quantity: req.body.quantity,
    });
    res.status(200).json(response);
}));
app.delete("/delete", auth_1.auth, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield cart.deleteCartItem({
            itemId: req.body.itemId,
        });
    }
    catch (e) {
        next(e);
    }
    res.status(200).json(express_1.response);
}));
app.delete("/delete-all", auth_1.auth, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const response = yield cart.deleteAllCartItems({
            userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id
        });
    }
    catch (e) {
        next(e);
    }
    res.status(200).json(express_1.response);
}));
exports.default = app;
//# sourceMappingURL=cart.js.map