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
// import twilio from "twilio";
// ; // Or, for ESM: import twilio from "twilio";
// // Find your Account SID and Auth Token at twilio.com/console
// // and set the environment variables. See http://twil.io/secure
// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const client = twilio(accountSid, authToken);
class Users {
    constructor() {
        this.repository = new users_1.UserRepository();
    }
    //sign up only for customers
    postSignup(customer) {
        return __awaiter(this, void 0, void 0, function* () {
            let { firstName, lastName, contact, email, password, role } = customer;
            const hash = yield bcrypt_1.default.hash(password, 10);
            password = hash;
            this.repository.createUser({
                firstName,
                lastName,
                contact,
                email,
                password,
                role,
            });
            return { status: "sucess" };
        });
    }
    // async verifyOtp(phoneNumber: string){
    //   const accountSid = process.env.TWILIO_ACCOUNT_SID as string;
    //   const authToken = process.env.TWILIO_AUTH_TOKEN as string;
    //   const client = twilio(accountSid, authToken);
    //   const verification = await client.verify.v2
    //   .services(accountSid)
    //   .verifications.create({
    //     channel: "sms",
    //     to: "+15017122661",
    //   });
    // }
    //works for sign in of users of all types of roles
    postSignIn(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            let { email, password, contact, } = req.body;
            const userAgent = req.headers["user-agent"];
            const isWebBrowser = /Mozilla|Chrome|Safari|Edge|Firefox/i.test(userAgent);
            const isAndroidApp = /Android/i.test(userAgent) && !isWebBrowser;
            const isIOSApp = /iPhone|iPad|iPod/i.test(userAgent) && !isWebBrowser;
            let response = yield this.repository.findUserByEmail({ email });
            const checkPassword = yield bcrypt_1.default.compare(password, response.password);
            if (checkPassword) {
                const data = {
                    id: response.id,
                };
                let jwtConfig = {
                    audience: "restrosync",
                    issuer: "zyptec pvt ltd",
                    subject: response.email,
                    expiresIn: "2s",
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
}
exports.Users = Users;
//# sourceMappingURL=users.js.map