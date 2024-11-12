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
const services_1 = require("../services");
const auth_1 = require("./middlewares/auth");
const formatResponse_1 = __importDefault(require("../utils/formatResponse"));
const app = (0, express_1.Router)();
const address = new services_1.Address();
app.post("/add-address", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log("REQUEST CVAME");
    req.body.userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const response = yield address.postAddress(req.body);
    const formattedResponse = (0, formatResponse_1.default)(req.newToken, response);
    res.status(200).json(formattedResponse);
}));
app.post("/update-address", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield address.patchAddress(req.body);
    const formattedResponse = (0, formatResponse_1.default)(req.newToken, response);
    res.status(200).json(formattedResponse);
}));
app.get("/get-addresses", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const response = yield address.getAddresses({ userId: userId });
    const formattedResponse = (0, formatResponse_1.default)(req.newToken, response);
    res.status(200).json(formattedResponse);
}));
exports.default = app;
//# sourceMappingURL=address.js.map