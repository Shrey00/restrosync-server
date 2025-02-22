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
exports.MenuRepository = void 0;
const connection_1 = __importDefault(require("../connection"));
const drizzle_orm_1 = require("drizzle-orm");
const menu_schema_1 = require("../drizzle/schema/menu_schema");
const ErrorHandler_1 = require("../../utils/ErrorHandler");
const categories_schema_1 = require("../drizzle/schema/categories_schema");
const types_schema_1 = require("../drizzle/schema/types_schema");
const menu_variants_schema_1 = require("../drizzle/schema/menu_variants_schema");
const restaurants_schema_1 = require("../drizzle/schema/restaurants_schema");
class MenuRepository {
    findMenuItems(params) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e;
            try {
                const conditions = [];
                conditions.push((0, drizzle_orm_1.or)((0, drizzle_orm_1.sql) `${menu_schema_1.menu.variant}=${"parent"}`, (0, drizzle_orm_1.sql) `${menu_schema_1.menu.variant}=${"none"}`));
                if (params.restaurantId) {
                    conditions.push((0, drizzle_orm_1.sql) `${menu_schema_1.menu.restaurantId}=${params.restaurantId}`);
                }
                if ((_a = params === null || params === void 0 ? void 0 : params.queryParams) === null || _a === void 0 ? void 0 : _a.searchQuery) {
                    conditions.push((0, drizzle_orm_1.sql) `${menu_schema_1.menu.name}=${params.queryParams.searchQuery}  or ${categories_schema_1.categories.name}=${params.queryParams.searchQuery}`);
                }
                if (((_b = params === null || params === void 0 ? void 0 : params.queryParams) === null || _b === void 0 ? void 0 : _b.cuisineType) === "veg") {
                    conditions.push((0, drizzle_orm_1.sql) `${menu_schema_1.menu.cuisineType}='veg'`);
                }
                else if (((_c = params === null || params === void 0 ? void 0 : params.queryParams) === null || _c === void 0 ? void 0 : _c.cuisineType) === "non-veg") {
                    conditions.push((0, drizzle_orm_1.sql) `${menu_schema_1.menu.cuisineType}='non-veg'`);
                }
                if ((params === null || params === void 0 ? void 0 : params.queryParams.ratingFrom) === "rating_2") {
                    conditions.push((0, drizzle_orm_1.sql) `${menu_schema_1.menu.rating}>2`);
                }
                else if ((params === null || params === void 0 ? void 0 : params.queryParams.ratingFrom) === "rating_3") {
                    conditions.push((0, drizzle_orm_1.sql) `${menu_schema_1.menu.rating}>3`);
                }
                else if ((params === null || params === void 0 ? void 0 : params.queryParams.ratingFrom) === "rating_4") {
                    conditions.push((0, drizzle_orm_1.sql) `${menu_schema_1.menu.rating}>4`);
                }
                let query = connection_1.default
                    .select({
                    id: menu_schema_1.menu.id,
                    name: menu_schema_1.menu.name,
                    // category: categories.name,
                    available: menu_schema_1.menu.available,
                    type: types_schema_1.types.name,
                    cuisineType: menu_schema_1.menu.cuisineType,
                    orders: menu_schema_1.menu.orders,
                    description: menu_schema_1.menu.description,
                    rating: menu_schema_1.menu.rating,
                    reviewSummary: menu_schema_1.menu.reviewSummary,
                    discount: menu_schema_1.menu.discount,
                    markedPrice: menu_schema_1.menu.markedPrice,
                    sellingPrice: menu_schema_1.menu.sellingPrice,
                    calories: menu_schema_1.menu.calories,
                    healthScore: menu_schema_1.menu.healthScore,
                    showHealthInfo: menu_schema_1.menu.showHealthInfo,
                    images: menu_schema_1.menu.images,
                    variant: menu_schema_1.menu.variant,
                })
                    .from(menu_schema_1.menu)
                    .where((0, drizzle_orm_1.and)(...conditions))
                    .innerJoin(categories_schema_1.categories, (0, drizzle_orm_1.sql) `${menu_schema_1.menu.category}=${categories_schema_1.categories.id}`)
                    .innerJoin(types_schema_1.types, (0, drizzle_orm_1.sql) `${menu_schema_1.menu.type}=${types_schema_1.types.id}`)
                    .$dynamic();
                if (((_d = params === null || params === void 0 ? void 0 : params.queryParams) === null || _d === void 0 ? void 0 : _d.sortBy) === "ascendingPrice") {
                    query = query.orderBy((0, drizzle_orm_1.sql) `${menu_schema_1.menu.sellingPrice} asc`);
                }
                else if (((_e = params === null || params === void 0 ? void 0 : params.queryParams) === null || _e === void 0 ? void 0 : _e.sortBy) === "descendingPrice") {
                    query = query.orderBy((0, drizzle_orm_1.sql) `${menu_schema_1.menu.sellingPrice} desc`);
                }
                const response = yield query;
                return response;
            }
            catch (e) {
                if (e instanceof Error)
                    throw new ErrorHandler_1.AppError(500, e === null || e === void 0 ? void 0 : e.message, "DB error", false);
            }
        });
    }
    findMenuItemsCategoryWise(params) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e;
            console.log("HERE", params.queryParams);
            try {
                const conditions = [];
                conditions.push((0, drizzle_orm_1.or)((0, drizzle_orm_1.sql) `${menu_schema_1.menu.variant}=${"parent"}`, (0, drizzle_orm_1.sql) `${menu_schema_1.menu.variant}=${"none"}`));
                if (params.restaurantId) {
                    conditions.push((0, drizzle_orm_1.sql) `${menu_schema_1.menu.restaurantId}=${params.restaurantId}`);
                }
                if ((_a = params === null || params === void 0 ? void 0 : params.queryParams) === null || _a === void 0 ? void 0 : _a.searchQuery) {
                    conditions.push((0, drizzle_orm_1.and)((0, drizzle_orm_1.sql) `(${categories_schema_1.categories.name} ILIKE ${"%" + params.queryParams.searchQuery + "%"} or ${menu_schema_1.menu.name} ILIKE ${"%" + params.queryParams.searchQuery + "%"})`));
                }
                if (((_b = params === null || params === void 0 ? void 0 : params.queryParams) === null || _b === void 0 ? void 0 : _b.cuisineType) === "veg") {
                    conditions.push((0, drizzle_orm_1.sql) `${menu_schema_1.menu.cuisineType}='veg'`);
                }
                else if (((_c = params === null || params === void 0 ? void 0 : params.queryParams) === null || _c === void 0 ? void 0 : _c.cuisineType) === "non-veg") {
                    conditions.push((0, drizzle_orm_1.sql) `${menu_schema_1.menu.cuisineType}='non-veg'`);
                }
                if ((params === null || params === void 0 ? void 0 : params.queryParams.ratingFrom) === "rating_2") {
                    conditions.push((0, drizzle_orm_1.sql) `${menu_schema_1.menu.rating}>2`);
                }
                else if ((params === null || params === void 0 ? void 0 : params.queryParams.ratingFrom) === "rating_3") {
                    conditions.push((0, drizzle_orm_1.sql) `${menu_schema_1.menu.rating}>3`);
                }
                else if ((params === null || params === void 0 ? void 0 : params.queryParams.ratingFrom) === "rating_4") {
                    conditions.push((0, drizzle_orm_1.sql) `${menu_schema_1.menu.rating}>4`);
                }
                let query = connection_1.default
                    .select({
                    categoryId: categories_schema_1.categories.id,
                    category: categories_schema_1.categories.name,
                    items: (0, drizzle_orm_1.sql) `json_agg(json_build_object(
            'id', ${menu_schema_1.menu.id},
            'name', ${menu_schema_1.menu.name},
            'available', ${menu_schema_1.menu.available},
            'cuisineType', ${menu_schema_1.menu.cuisineType},
            'orders', ${menu_schema_1.menu.orders},
            'description', ${menu_schema_1.menu.description},
            'rating', ${menu_schema_1.menu.rating},
            'reviewSummary', ${menu_schema_1.menu.reviewSummary},
            'discount', ${menu_schema_1.menu.discount},
            'markedPrice', ${menu_schema_1.menu.markedPrice},
            'sellingPrice', ${menu_schema_1.menu.sellingPrice},
            'calories', ${menu_schema_1.menu.calories},
            'healthScore', ${menu_schema_1.menu.healthScore},
            'healthInfo', ${menu_schema_1.menu.showHealthInfo},
            'images', ${menu_schema_1.menu.images},
            'variant', ${menu_schema_1.menu.variant}
          ))`,
                })
                    .from(menu_schema_1.menu)
                    .where((0, drizzle_orm_1.and)(...conditions))
                    .innerJoin(categories_schema_1.categories, (0, drizzle_orm_1.sql) `${menu_schema_1.menu.category}=${categories_schema_1.categories.id}`)
                    .innerJoin(types_schema_1.types, (0, drizzle_orm_1.sql) `${menu_schema_1.menu.type}=${types_schema_1.types.id}`)
                    .groupBy(categories_schema_1.categories.name, categories_schema_1.categories.id)
                    .$dynamic();
                if (((_d = params === null || params === void 0 ? void 0 : params.queryParams) === null || _d === void 0 ? void 0 : _d.sortBy) === "ascendingPrice") {
                    query = query.orderBy((0, drizzle_orm_1.sql) `${menu_schema_1.menu.sellingPrice} asc`);
                }
                else if (((_e = params === null || params === void 0 ? void 0 : params.queryParams) === null || _e === void 0 ? void 0 : _e.sortBy) === "descendingPrice") {
                    query = query.orderBy((0, drizzle_orm_1.sql) `${menu_schema_1.menu.sellingPrice} desc`);
                }
                // console.log("-------------------------------------------------------------------------")
                const response = yield query;
                // console.log(response);
                return response;
            }
            catch (e) {
                if (e instanceof Error)
                    throw new ErrorHandler_1.AppError(500, e === null || e === void 0 ? void 0 : e.message, "DB error", false);
            }
        });
    }
    findMenuItemVariants(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield connection_1.default
                    .select({
                    id: menu_schema_1.menu.id,
                    name: menu_schema_1.menu.name,
                    markedPrice: menu_schema_1.menu.markedPrice,
                    sellingPrice: menu_schema_1.menu.sellingPrice,
                    variant: menu_schema_1.menu.variant,
                    variantName: menu_variants_schema_1.menuVariants.name,
                    discount: menu_schema_1.menu.discount,
                })
                    .from(menu_variants_schema_1.menuVariants)
                    .innerJoin(menu_schema_1.menu, (0, drizzle_orm_1.sql) `${menu_variants_schema_1.menuVariants.variantId}=${menu_schema_1.menu.id}`)
                    .where((0, drizzle_orm_1.sql) `${menu_variants_schema_1.menuVariants.mainItemId}=${params.menuItemId}`)
                    .orderBy((0, drizzle_orm_1.sql) `${menu_schema_1.menu.name}`);
                return response;
            }
            catch (e) {
                if (e instanceof Error)
                    throw new ErrorHandler_1.AppError(500, e === null || e === void 0 ? void 0 : e.message, "DB error", true);
            }
        });
    }
    createMenuItem(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let { restaurantId, name, category, type, cuisineType, description, available, markedPrice, sellingPrice, discount, calories, healthScore, showHealthInfo, images, variant, } = params;
            try {
                const response = yield connection_1.default
                    .insert(menu_schema_1.menu)
                    .values({
                    restaurantId,
                    name,
                    category,
                    type,
                    available,
                    cuisineType,
                    description,
                    markedPrice,
                    sellingPrice,
                    discount,
                    calories,
                    healthScore,
                    showHealthInfo,
                    images,
                    variant,
                })
                    .returning({
                    id: menu_schema_1.menu.id,
                    name: menu_schema_1.menu.name,
                    category: menu_schema_1.menu.category,
                    type: menu_schema_1.menu.type,
                    available: menu_schema_1.menu.available,
                    cuisineType: menu_schema_1.menu.cuisineType,
                    description: menu_schema_1.menu.description,
                    markedPrice: menu_schema_1.menu.markedPrice,
                    sellingPrice: menu_schema_1.menu.sellingPrice,
                    discount: menu_schema_1.menu.discount,
                    calories: menu_schema_1.menu.calories,
                    healthScore: menu_schema_1.menu.healthScore,
                    rating: menu_schema_1.menu.rating,
                    variant: menu_schema_1.menu.variant,
                    showHealthInfo: menu_schema_1.menu.showHealthInfo,
                    images: menu_schema_1.menu.images,
                });
                if (response.length)
                    return response;
            }
            catch (e) {
                if (e instanceof Error)
                    throw new ErrorHandler_1.AppError(500, e === null || e === void 0 ? void 0 : e.message, "DB error", false);
            }
        });
    }
    createMenuItemVariants(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                for (const item of params) {
                    (() => __awaiter(this, void 0, void 0, function* () {
                        const { mainItemId, variantName } = item;
                        const response = yield this.createMenuItem(item);
                        yield connection_1.default.insert(menu_variants_schema_1.menuVariants).values({
                            mainItemId: mainItemId,
                            variantId: response && response[0].id,
                            name: variantName,
                        });
                    }))();
                }
            }
            catch (e) {
                if (e instanceof Error)
                    throw new ErrorHandler_1.AppError(500, e === null || e === void 0 ? void 0 : e.message, "DB error", false);
            }
        });
    }
    findAndUpdateMenu(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield connection_1.default
                    .update(menu_schema_1.menu)
                    .set(params)
                    .where((0, drizzle_orm_1.sql) `${menu_schema_1.menu.id}=${params.id}`)
                    .returning({
                    updatedAt: menu_schema_1.menu.updatedAt,
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
    findMenuItemCategoriesAndTypes() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield connection_1.default
                    .select({
                    id: types_schema_1.types.id,
                    type: types_schema_1.types.name,
                    categories: (0, drizzle_orm_1.sql) `json_agg(json_build_object(
              'id', ${categories_schema_1.categories.id},
              'name', ${categories_schema_1.categories.name}
            ))`,
                })
                    .from(categories_schema_1.categories)
                    .innerJoin(types_schema_1.types, (0, drizzle_orm_1.sql) `${categories_schema_1.categories.type}=${types_schema_1.types.id}`)
                    .groupBy(types_schema_1.types.name, types_schema_1.types.id);
                if (response.length > 0)
                    return response;
            }
            catch (e) {
                if (e instanceof Error)
                    throw new ErrorHandler_1.AppError(500, e === null || e === void 0 ? void 0 : e.message, "DB error", true);
            }
        });
    }
    createCategory(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield connection_1.default
                    .insert(categories_schema_1.categories)
                    .values({ category: params.category, type: params.type })
                    .returning({ id: categories_schema_1.categories.id });
                if (response.length > 0)
                    return response;
            }
            catch (e) {
                if (e instanceof Error)
                    throw new ErrorHandler_1.AppError(500, e === null || e === void 0 ? void 0 : e.message, "DB error", true);
            }
        });
    }
    deleteMenuItem(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield connection_1.default
                    .delete(menu_schema_1.menu)
                    .where((0, drizzle_orm_1.sql) `${menu_schema_1.menu.id}=${params.menuItemId}`);
                if (response.length > 0)
                    return response;
            }
            catch (e) {
                if (e instanceof Error)
                    throw new ErrorHandler_1.AppError(500, e === null || e === void 0 ? void 0 : e.message, "DB error", true);
            }
        });
    }
    search(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield connection_1.default
                    .select({
                    itemName: menu_schema_1.menu.name,
                    restaurantName: restaurants_schema_1.restaurants.name,
                    restaurantId: restaurants_schema_1.restaurants.id,
                    cuisineType: menu_schema_1.menu.cuisineType,
                    categoryName: categories_schema_1.categories.name,
                })
                    .from(menu_schema_1.menu)
                    .innerJoin(categories_schema_1.categories, (0, drizzle_orm_1.sql) `${menu_schema_1.menu.category}=${categories_schema_1.categories.id}`)
                    .innerJoin(restaurants_schema_1.restaurants, (0, drizzle_orm_1.sql) `${menu_schema_1.menu.restaurantId}=${restaurants_schema_1.restaurants.id}`)
                    .where((0, drizzle_orm_1.sql) `(${menu_schema_1.menu.name} ILIKE ${"%" + params.searchQuery + "%"} or ${categories_schema_1.categories.name} ILIKE ${"%" + params.searchQuery + "%"}) and (${menu_schema_1.menu.variant}=${"parent"} or ${menu_schema_1.menu.variant}=${"none"})`);
                return response;
            }
            catch (e) {
                if (e instanceof Error)
                    throw new ErrorHandler_1.AppError(500, e === null || e === void 0 ? void 0 : e.message, "DB error", true);
            }
        });
    }
    getTopTenItems(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield connection_1.default
                    .select({
                    id: menu_schema_1.menu.id,
                    name: menu_schema_1.menu.name,
                    available: menu_schema_1.menu.available,
                    cuisineType: menu_schema_1.menu.cuisineType,
                    orders: menu_schema_1.menu.orders,
                    description: menu_schema_1.menu.description,
                    rating: menu_schema_1.menu.rating,
                    reviewSummary: menu_schema_1.menu.reviewSummary,
                    discount: menu_schema_1.menu.discount,
                    markedPrice: menu_schema_1.menu.markedPrice,
                    sellingPrice: menu_schema_1.menu.sellingPrice,
                    calories: menu_schema_1.menu.calories,
                    healthScore: menu_schema_1.menu.healthScore,
                    showHealthInfo: menu_schema_1.menu.showHealthInfo,
                    images: menu_schema_1.menu.images,
                    variant: menu_schema_1.menu.variant,
                })
                    .from(menu_schema_1.menu)
                    .innerJoin(restaurants_schema_1.restaurants, (0, drizzle_orm_1.sql) `${menu_schema_1.menu.restaurantId}=${restaurants_schema_1.restaurants.id}`)
                    .where((0, drizzle_orm_1.sql) `${restaurants_schema_1.restaurants.softwareId}=${params.softwareId} AND (${menu_schema_1.menu.variant}=${"parent"} OR ${menu_schema_1.menu.variant}=${"none"})`)
                    .orderBy((0, drizzle_orm_1.sql) `${menu_schema_1.menu.orders} desc`)
                    .limit(10);
                return response;
            }
            catch (e) {
                if (e instanceof Error)
                    throw new ErrorHandler_1.AppError(500, e === null || e === void 0 ? void 0 : e.message, "DB error", true);
            }
        });
    }
}
exports.MenuRepository = MenuRepository;
//# sourceMappingURL=menu.js.map