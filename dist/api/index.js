"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderRoutes = exports.addressRoutes = exports.cartRoutes = exports.menuRoutes = exports.restaurantRoutes = exports.userRoutes = void 0;
var users_1 = require("./users");
Object.defineProperty(exports, "userRoutes", { enumerable: true, get: function () { return __importDefault(users_1).default; } });
var restaurants_1 = require("./restaurants");
Object.defineProperty(exports, "restaurantRoutes", { enumerable: true, get: function () { return __importDefault(restaurants_1).default; } });
var menu_1 = require("./menu");
Object.defineProperty(exports, "menuRoutes", { enumerable: true, get: function () { return __importDefault(menu_1).default; } });
var cart_1 = require("./cart");
Object.defineProperty(exports, "cartRoutes", { enumerable: true, get: function () { return __importDefault(cart_1).default; } });
var address_1 = require("./address");
Object.defineProperty(exports, "addressRoutes", { enumerable: true, get: function () { return __importDefault(address_1).default; } });
var orders_1 = require("./orders");
Object.defineProperty(exports, "orderRoutes", { enumerable: true, get: function () { return __importDefault(orders_1).default; } });
//# sourceMappingURL=index.js.map