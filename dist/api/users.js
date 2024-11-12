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
const express_1 = require("express");
const services_1 = require("../services");
const auth_1 = require("./middlewares/auth");
const formatResponse_1 = __importDefault(require("../utils/formatResponse"));
const auth_2 = require("./middlewares/auth");
const app = (0, express_1.Router)();
const users = new services_1.Users();
app.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield users.postSignup(req.body);
    res.status(200).json(response);
}));
app.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield users.postSignIn(req, res);
    const response = (0, formatResponse_1.default)(null, data);
    res.status(200).json(response);
}));
app.get("/user", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log("request came");
    let response;
    const data = yield users.getUser({ id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id });
    response = (0, formatResponse_1.default)(req.newToken, data);
    res.status(200).json(response);
}));
app.post("/refresh-token", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("yeahhha be");
    console.log(req.body);
    console.log(JSON.stringify(req.body));
    const refreshed = yield (0, auth_2.refreshExpiredToken)(req.body.refreshToken);
    res.status(200).json({ newToken: refreshed.newToken });
}));
exports.default = app;
//delivery signup -> delivery management side app.
//consumer signup -> public app.
//admin and other manager signup -> occurs through this app, and web admin panel
//# sourceMappingURL=users.js.map