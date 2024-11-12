"use strict";
/**
 * @TODO - Implement Error handling with best practices
 * @TODO - Make the code more typesafe
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const api_1 = require("./api");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
// const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
// dotenv.config({ path: envFile });
const app = (0, express_1.default)();
//Middlwares
app.use("/assets", express_1.default.static(path_1.default.join(__dirname, "assets")));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    exposedHeaders: "Authorization",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    origin: "http://localhost:3000",
}));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
//Routes
app.use("/", api_1.userRoutes);
app.use("/restaurants", api_1.restaurantRoutes);
app.use("/menu", api_1.menuRoutes);
app.use("/orders", api_1.orderRoutes);
app.use("/address", api_1.addressRoutes);
app.use("/cart", api_1.cartRoutes);
app.use((err, req, res, next) => {
    res
        .status(err.httpCode)
        .json({ statusCode: err.httpCode, name: err.name, desc: err.description });
});
const PORT = process.env.PORT ? process.env.PORT : 4000;
app.listen(PORT, () => {
    console.log("server listening at " + PORT);
});
//Users
//Restaurants and Menu, Sales and Orders, Cart, Delivery, Dashboard
//# sourceMappingURL=index.js.map