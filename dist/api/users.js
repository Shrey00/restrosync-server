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
app.post("/signup", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield users.postSignup(req.body);
    res.status(200).json(response);
}));
app.post("/signin", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield users.postSignIn(req, res);
        const response = (0, formatResponse_1.default)(null, data);
        if (data.statusCode === 401)
            res.status(401).json(data);
        res.status(200).json(response);
    }
    catch (e) {
        next(e);
    }
}));
app.post("/send-otp-login", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { phone } = req.body;
    if (!phone) {
        return res.status(400).json({ error: "Phone number is required" });
    }
    try {
        const user = yield users.getUserByPhone({ contact: req.body.phone });
        if (user) {
            const result = yield users.sendVerificationCode(phone);
            return res.status(200).json(result);
        }
        return res
            .status(200)
            .json({ desc: "Phone number not found", statusCode: 401 });
    }
    catch (error) {
        next(error);
    }
}));
app.post("/send-otp-signup", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { phone } = req.body;
    if (!phone) {
        return res.status(400).json({ error: "Phone number is required" });
    }
    try {
        const result = yield users.sendVerificationCode(phone);
        return res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
}));
// Route to verify OTP
app.post("/verify-otp-login", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { phone, otp } = req.body;
    if (!phone || !otp) {
        return res
            .status(400)
            .json({ error: "Phone number and OTP are required" });
    }
    try {
        const response = yield users.verifyCode(phone, otp);
        if (response.valid && response.status === "approved") {
            const data = yield users.postSignInWithPhone(phone, otp);
            return res.status(200).json(data);
        }
        else {
            return res.status(200).json({ statusCode: 400, error: "Invalid OTP" });
        }
    }
    catch (error) {
        next(error);
    }
}));
app.post("/verify-otp-signup", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { phone, otp } = req.body;
    console.log("BODY");
    console.log(req.body);
    if (!phone || !otp) {
        return res
            .status(400)
            .json({ error: "Phone number and OTP are required" });
    }
    try {
        const response = yield users.verifyCode(phone, otp);
        if (response.valid && response.status === "approved") {
            const data = yield users.postSignup(req.body);
            return res.status(200).json(data);
        }
        else {
            return res.status(200).json({ statusCode: 400, error: "Invalid OTP" });
        }
    }
    catch (error) {
        next(error);
    }
}));
app.patch("/delete-account", auth_1.auth, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const data = yield users.deleteAccount({
            userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
        });
        const response = (0, formatResponse_1.default)(null, data);
        res.status(200).json(response);
    }
    catch (e) {
        next(e);
    }
}));
app.get("/user", auth_1.auth, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        let response;
        console.log(req.user);
        const data = yield users.getUser({ id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id });
        response = (0, formatResponse_1.default)(req.newToken, data);
        res.status(200).json(response);
    }
    catch (e) {
        next(e);
    }
}));
app.post("/refresh-token", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshed = yield (0, auth_2.refreshExpiredToken)(req.body.refreshToken);
    res.status(200).json({ newToken: refreshed.newToken });
}));
exports.default = app;
//delivery signup -> delivery management side app.
//consumer signup -> public app.
//admin and other manager signup -> occurs through this app, and web admin panel
//# sourceMappingURL=users.js.map