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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Restaurants = void 0;
const repository_1 = require("../database/repository");
class Restaurants {
    constructor() {
        this.repository = new repository_1.RestaurantRepository();
    }
    postRestaurant(restaurant) {
        return __awaiter(this, void 0, void 0, function* () {
            let { userId, name, email, contact, countryCode, description, logo, images, cuisineType, opensAt, closesAt, acceptingOrders, } = restaurant;
            const data = this.repository.createRestaurant({
                userId,
                name,
                email,
                contact,
                countryCode,
                description,
                logo,
                images,
                cuisineType,
                opensAt,
                closesAt,
                acceptingOrders,
            });
            return data;
        });
    }
    postAddress(address) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = this.repository(address);
            if (data)
                return data;
        });
    }
    getRestaurant(restaurant) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = restaurant;
            const data = this.repository.findRestaurant({ id });
            if (data)
                return data;
        });
    }
    getRestaurantsByUsers(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = params;
            const data = this.repository.findRestaurantsByUsers({ userId });
            if (data)
                return data;
        });
    }
    getRestaurants(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = this.repository.findRestaurants(params);
            return data;
        });
    }
    updateRestaurant(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = this.repository.findAndUpdateRestaurant(params);
            if (data)
                return data;
        });
    }
}
exports.Restaurants = Restaurants;
//# sourceMappingURL=restaurants.js.map