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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantRepository = void 0;
const connection_1 = __importDefault(require("../connection"));
const drizzle_orm_1 = require("drizzle-orm");
const restaurants_schema_1 = require("../drizzle/schema/restaurants_schema");
const user_restaurant_relation_schema_1 = require("../drizzle/schema/user_restaurant_relation_schema");
const ErrorHandler_1 = require("../../utils/ErrorHandler");
// function convertTo12Hour(time24 : string) {
//   // Split the input time into hours, minutes, and seconds
//   let [hours, minutes, seconds] = time24.split(':').map(Number);
//   const ampm = hours >= 12 ? 'PM' : 'AM';
//   hours = hours % 12 || 12;
//   return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${ampm}`;
// }
class RestaurantRepository {
    createRestaurant(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let { userId, name, email, contact, countryCode, description, rating, logo, images, cuisineType, //veg,non-veg or multi-cuisine
            opensAt, closesAt, acceptingOrders, } = params;
            try {
                const response = yield connection_1.default.transaction((txn) => __awaiter(this, void 0, void 0, function* () {
                    const insertedRestaurant = yield txn
                        .insert(restaurants_schema_1.restaurants)
                        .values({
                        name,
                        email,
                        contact,
                        countryCode,
                        description,
                        logo,
                        images,
                        cuisineType, //veg,non-veg or multi-cuisine
                        opensAt,
                        closesAt,
                    })
                        .returning({
                        id: restaurants_schema_1.restaurants.id,
                    });
                    //creates many-to-many relation between user(admin and other roles) and restaurant
                    yield txn.insert(user_restaurant_relation_schema_1.relationUsersRestaurants).values({
                        userId,
                        restaurantId: insertedRestaurant[0].id,
                    });
                }));
            }
            catch (e) {
                if (e instanceof Error)
                    throw new ErrorHandler_1.AppError(500, e === null || e === void 0 ? void 0 : e.message, "DB error", true);
            }
        });
    }
    findRestaurant(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = params;
            try {
                const response = yield connection_1.default
                    .select({
                    id: restaurants_schema_1.restaurants.id,
                    name: restaurants_schema_1.restaurants.name,
                    contact: restaurants_schema_1.restaurants.contact,
                    rating: restaurants_schema_1.restaurants.rating,
                    address: restaurants_schema_1.restaurants.address,
                    opensAt: restaurants_schema_1.restaurants.opensAt,
                    closesAt: restaurants_schema_1.restaurants.closesAt,
                    logo: restaurants_schema_1.restaurants.logo,
                    cuisineType: restaurants_schema_1.restaurants.cuisineType,
                    acceptingOrders: restaurants_schema_1.restaurants.acceptingOrders,
                })
                    .from(restaurants_schema_1.restaurants)
                    .where((0, drizzle_orm_1.sql) `${restaurants_schema_1.restaurants.id} = ${id}`);
                if (response.length > 0)
                    return response[0];
                return { message: "DB Error", status: 500 };
            }
            catch (e) {
                if (e instanceof Error)
                    throw new ErrorHandler_1.AppError(500, e === null || e === void 0 ? void 0 : e.message, "DB error", true);
            }
        });
    }
    findRestaurants(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { softwareId } = params;
            console.log("Whaaat");
            try {
                const response = yield connection_1.default
                    .select({
                    id: restaurants_schema_1.restaurants.id,
                    name: restaurants_schema_1.restaurants.name,
                    contact: restaurants_schema_1.restaurants.contact,
                    rating: restaurants_schema_1.restaurants.rating,
                    address: restaurants_schema_1.restaurants.address,
                    opensAt: restaurants_schema_1.restaurants.opensAt,
                    closesAt: restaurants_schema_1.restaurants.closesAt,
                    logo: restaurants_schema_1.restaurants.logo,
                    cuisineType: restaurants_schema_1.restaurants.cuisineType,
                    acceptingOrders: restaurants_schema_1.restaurants.acceptingOrders,
                })
                    .from(restaurants_schema_1.restaurants)
                    .where((0, drizzle_orm_1.sql) `${restaurants_schema_1.restaurants.softwareId}=${softwareId}`);
                return response;
            }
            catch (e) {
                if (e instanceof Error)
                    throw new ErrorHandler_1.AppError(500, e === null || e === void 0 ? void 0 : e.message, "DB error", true);
            }
        });
    }
    findRestaurantsByUsers(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = params;
            try {
                const response = yield connection_1.default
                    .select({
                    id: restaurants_schema_1.restaurants.id,
                    name: restaurants_schema_1.restaurants.name,
                    rating: restaurants_schema_1.restaurants.rating,
                    logo: restaurants_schema_1.restaurants.logo,
                    opensAt: (0, drizzle_orm_1.sql) `to_char(${restaurants_schema_1.restaurants.opensAt}, 'HH12:MI AM')`,
                    closesAt: (0, drizzle_orm_1.sql) `to_char(${restaurants_schema_1.restaurants.closesAt}, 'HH12:MI AM')`,
                    cuisineType: restaurants_schema_1.restaurants.cuisineType,
                    acceptingOrders: restaurants_schema_1.restaurants.acceptingOrders,
                    nextOpeningTime: (0, drizzle_orm_1.sql) `to_char(${restaurants_schema_1.restaurants.nextOpeningTime}, 'HH12:MI AM')`, //only to be used for temporary opening and closing of restaurants
                    nextClosingTime: (0, drizzle_orm_1.sql) `to_char(${restaurants_schema_1.restaurants.nextClosingTime}, 'HH12:MI AM')`,
                })
                    .from(restaurants_schema_1.restaurants)
                    .innerJoin(user_restaurant_relation_schema_1.relationUsersRestaurants, (0, drizzle_orm_1.sql) `${user_restaurant_relation_schema_1.relationUsersRestaurants.restaurantId}=${restaurants_schema_1.restaurants.id}`)
                    .where((0, drizzle_orm_1.sql) `${user_restaurant_relation_schema_1.relationUsersRestaurants.userId}=${userId}`);
                if (response.length > 0)
                    return response;
            }
            catch (e) {
                if (e instanceof Error)
                    throw new ErrorHandler_1.AppError(500, e === null || e === void 0 ? void 0 : e.message, "DB error", false);
            }
        });
    }
    findAndUpdateRestaurant(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = params, restaurant = __rest(params, ["userId"]);
            try {
                const response = yield connection_1.default
                    .update(restaurants_schema_1.restaurants)
                    .set(restaurant)
                    .where((0, drizzle_orm_1.sql) `${restaurant.id}=${restaurant.id}`)
                    .returning({
                    updatedAt: restaurants_schema_1.restaurants.updatedAt,
                });
                if (response.length > 0)
                    return { message: "successfully updated", status: 200 };
            }
            catch (e) {
                if (e instanceof Error)
                    throw new ErrorHandler_1.AppError(500, e === null || e === void 0 ? void 0 : e.message, "DB error", true);
            }
        });
    }
}
exports.RestaurantRepository = RestaurantRepository;
//# sourceMappingURL=restaurants.js.map