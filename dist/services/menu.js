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
exports.Menu = void 0;
const repository_1 = require("../database/repository");
class Menu {
    constructor() {
        this.repository = new repository_1.MenuRepository();
    }
    postMenuItem(menuItem) {
        return __awaiter(this, void 0, void 0, function* () {
            let { userId, restaurantId, category, name, type, cuisineType, orders, available, description, markedPrice, sellingPrice, discount, calories, healthScore, showHealthInfo, images, } = menuItem;
            const data = yield this.repository.createMenuItem({
                userId,
                restaurantId,
                category,
                name,
                type,
                available,
                cuisineType,
                orders,
                description,
                markedPrice,
                sellingPrice,
                discount,
                calories,
                healthScore,
                showHealthInfo,
                images,
            });
            return data;
        });
    }
    getMenuItems(params, queryParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const restaurantId = params.restaurantId;
            const data = yield this.repository.findMenuItems({
                restaurantId,
                queryParams,
            });
            console.log("RESPONSE", data);
            if (data)
                return data;
        });
    }
    getMenuItemsCategoryWise(params, queryParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const restaurantId = params.restaurantId;
            const data = yield this.repository.findMenuItemsCategoryWise({
                restaurantId,
                queryParams,
            });
            console.log("RESPONSE", data);
            if (data)
                return data;
        });
    }
    getMenuVariants(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.repository.findMenuItemVariants(params);
            if (data)
                return data;
        });
    }
    postMenuVariants(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.repository.createMenuItemVariants(params);
            if (data)
                return data;
        });
    }
    deleteMenuItem(param) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.repository.deleteMenuItem();
            if (data)
                return data;
        });
    }
    updateRestaurant(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.repository.findAndUpdateMenu(params);
            if (data)
                return data;
        });
    }
    getMenuCategoriesAndType() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.repository.findMenuItemCategoriesAndTypes();
            if (data)
                return data;
        });
    }
    postCategoryUnderAType(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.repository.createCategory(params);
            if (data)
                return data;
        });
    }
    search(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.repository.search(params);
            return data;
        });
    }
}
exports.Menu = Menu;
//# sourceMappingURL=menu.js.map