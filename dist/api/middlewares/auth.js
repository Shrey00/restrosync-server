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
exports.refreshExpiredToken = refreshExpiredToken;
exports.auth = auth;
//verify
//sign token
require("dotenv/config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jsonwebtoken_2 = require("jsonwebtoken");
function refreshExpiredToken(refreshToken) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("REFRESH REUIRED BRO", refreshToken);
        const secret = process.env.JWT_SECRET;
        return new Promise((resolve, reject) => {
            jsonwebtoken_1.default.verify(refreshToken, secret, (err, decoded) => {
                if (err) {
                    reject(err);
                }
                else {
                    let jwtConfig = {
                        audience: "restrosync",
                        issuer: "zyptec pvt ltd",
                        subject: decoded.sub,
                        expiresIn: "1y",
                    };
                    const data = { id: decoded.id };
                    const token = jsonwebtoken_1.default.sign(data, process.env.JWT_SECRET, jwtConfig);
                    resolve({ decoded, newToken: token });
                }
            });
        });
    });
}
function auth(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const secret = process.env.JWT_SECRET;
        const userAgent = req.headers["user-agent"];
        const mobilePlatformHeader = req.headers['x-platform'];
        let refreshToken;
        console.log(userAgent);
        const isWebBrowser = /Mozilla|Chrome|Safari|Edge|Firefox/i.test(userAgent);
        const isAndroidApp = /android/i.test(mobilePlatformHeader) && !isWebBrowser;
        const isIOSApp = /ios/i.test(mobilePlatformHeader) && !isWebBrowser;
        const authorizationHeader = req.headers["authorization"];
        if (isWebBrowser)
            refreshToken = req.cookies.refreshToken;
        if (authorizationHeader) {
            console.log("USSER");
            const tokenParts = authorizationHeader === null || authorizationHeader === void 0 ? void 0 : authorizationHeader.split(" ");
            if (tokenParts.length === 2 && tokenParts[0].toLowerCase() == "bearer") {
                const token = tokenParts[1];
                jsonwebtoken_1.default.verify(token, secret, (err, decoded) => __awaiter(this, void 0, void 0, function* () {
                    if (err instanceof jsonwebtoken_2.TokenExpiredError) {
                        //for creating a separate route of refreshing token, if it is a mobile app.
                        if (isAndroidApp || isIOSApp) {
                            res.status(401).json({ tokenErr: "expired" });
                        }
                        if (refreshToken) {
                            const refreshed = yield refreshExpiredToken(refreshToken);
                            if (refreshed.newToken === "error") {
                                res.status(401).json({ error: "Unauthorised or Expired Token" });
                            }
                            req.user = refreshed.decoded;
                            req.newToken = refreshed.newToken;
                            next();
                        }
                    }
                    else {
                        req.user = decoded;
                        next();
                    }
                }));
            }
        }
        else {
            //@Todo Make a way to redirect to sign in if there is no authorization header
            res.redirect("/signin");
        }
        // return res.status(401).json({ error: "Unauthorized: No token provided" });
    });
}
//# sourceMappingURL=auth.js.map