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
exports.Users = void 0;
const users_1 = require("../database/repository/users");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ErrorHandler_1 = require("../utils/ErrorHandler");
const twilio_1 = __importDefault(require("twilio"));
require("dotenv/config");
class Users {
    constructor() {
        this.repository = new users_1.UserRepository();
        this.client = (0, twilio_1.default)(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    }
    //sign up only for customers
    postSignup(customer) {
        return __awaiter(this, void 0, void 0, function* () {
            let { firstName, lastName, phone, email, password } = customer;
            console.log(password);
            console.log(customer);
            const hash = yield bcrypt_1.default.hash(password, 10);
            password = hash;
            const response = yield this.repository.createUser({
                firstName,
                lastName,
                contact: phone,
                email,
                password,
                contactVerified: true,
            });
            const data = {
                id: response.id,
            };
            let jwtConfig = {
                audience: "restrosync",
                issuer: "zyptec pvt ltd",
                subject: response.email,
                expiresIn: "1y",
            };
            let signedToken = jsonwebtoken_1.default.sign(data, process.env.JWT_SECRET, jwtConfig);
            let refreshToken = jsonwebtoken_1.default.sign(data, process.env.JWT_SECRET, jwtConfig);
            const responseData = [
                {
                    firstName: response.firstName,
                    lastName: response.lastName,
                    email: response.email,
                    role: response.role,
                    contact: response.contact,
                    countryCode: response.countryCode,
                    loyaltyPoints: response.loyaltyPoints,
                    refreshToken: refreshToken,
                    token: signedToken,
                },
            ];
            return responseData;
        });
    }
    postSignIn(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { email, password, contact, } = req.body;
            const userAgent = req.headers["user-agent"];
            const isWebBrowser = /Mozilla|Chrome|Safari|Edge|Firefox/i.test(userAgent);
            const isAndroidApp = /Android/i.test(userAgent) && !isWebBrowser;
            const isIOSApp = /iPhone|iPad|iPod/i.test(userAgent) && !isWebBrowser;
            let response = yield this.repository.findUserByEmail({ email });
            if (!response)
                return {
                    statusCode: 401,
                    name: "Unauthorized",
                    desc: "Wrong email or password",
                };
            const checkPassword = yield bcrypt_1.default.compare(password, response.password);
            if (checkPassword) {
                const data = {
                    id: response.id,
                };
                let jwtConfig = {
                    audience: "restrosync",
                    issuer: "zyptec pvt ltd",
                    subject: response.email,
                    expiresIn: "1y",
                };
                let signedToken = jsonwebtoken_1.default.sign(data, process.env.JWT_SECRET, jwtConfig);
                jwtConfig.expiresIn = "1y";
                let refreshToken = jsonwebtoken_1.default.sign(data, process.env.JWT_SECRET, jwtConfig);
                const responseData = [
                    {
                        firstName: response.firstName,
                        lastName: response.lastName,
                        email: response.email,
                        role: response.role,
                        contact: response.contact,
                        countryCode: response.countryCode,
                        loyaltyPoints: response.loyaltyPoints,
                        refreshToken: refreshToken,
                        token: signedToken,
                    },
                ];
                if (isWebBrowser) {
                    res.cookie("refreshToken", refreshToken, {
                        secure: true,
                        httpOnly: false,
                        sameSite: "none",
                        maxAge: 7 * 24 * 60 * 60 * 1000,
                    });
                }
                return responseData;
            }
            else {
                throw new ErrorHandler_1.AppError(401, "Unauthorized: Please check your email/password", "Wrong email or password", true);
            }
        });
    }
    getUser(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id }) {
            let data = yield this.repository.findUserById({ id });
            return [data];
        });
    }
    getUserByPhone(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = yield this.repository.findUserByContact(params);
            return data;
        });
    }
    deleteAccount(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.repository.patchAccountActiveStatus({
                userId: params.userId,
            });
            return response;
        });
    }
    /**
     * Send an OTP via Twilio Verify Service
     * @param phone - Phone number to send the OTP
     * @returns {Promise<{ message: string }>}
     */
    sendVerificationCode(phone) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.client.verify.v2
                .services("VAa1cad9454e7d4f80f443f9009ab24fe2")
                .verifications.create({ to: "+91" + phone, channel: "sms" });
            if (response.status === "pending") {
                return { message: "OTP sent successfully" };
            }
            else {
                throw new Error("Failed to send OTP");
            }
        });
    }
    /**
     * Verify the OTP using Twilio Verify Service
     * @param phone - Phone number to verify
     * @param otp - OTP to verify
     * @returns {Promise<any>}
     */
    verifyCode(phone, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.client.verify.v2
                .services("VAa1cad9454e7d4f80f443f9009ab24fe2")
                .verificationChecks.create({ to: "+91" + phone, code: otp });
            return response;
        });
    }
    postSignInWithPhone(phone, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.getUserByPhone({ contact: phone });
            const data = {
                id: response.id,
            };
            let jwtConfig = {
                audience: "restrosync",
                issuer: "zyptec pvt ltd",
                subject: response.email,
                expiresIn: "1y",
            };
            let signedToken = jsonwebtoken_1.default.sign(data, process.env.JWT_SECRET, jwtConfig);
            let refreshToken = jsonwebtoken_1.default.sign(data, process.env.JWT_SECRET, jwtConfig);
            const responseData = [
                {
                    firstName: response.firstName,
                    lastName: response.lastName,
                    email: response.email,
                    role: response.role,
                    contact: response.contact,
                    countryCode: response.countryCode,
                    loyaltyPoints: response.loyaltyPoints,
                    refreshToken: refreshToken,
                    token: signedToken,
                },
            ];
            return responseData;
        });
    }
}
exports.Users = Users;
//# sourceMappingURL=users.js.map