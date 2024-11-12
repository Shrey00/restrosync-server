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
const path_1 = __importDefault(require("path"));
const storage_1 = require("./middlewares/storage");
const app = (0, express_1.Router)();
const restaurants = new services_1.Restaurants();
// Define the types for `req.files` fields
app.post("/create", storage_1.restaurantUpload.fields([
    { name: "logo", maxCount: 1 },
    { name: "images", maxCount: 5 },
]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const files = req.files;
    const images = files === null || files === void 0 ? void 0 : files.images;
    const logo = (files === null || files === void 0 ? void 0 : files.logo) ? files.logo[0] : null;
    const imagePaths = images.map((file) => path_1.default.join("restaurant", file === null || file === void 0 ? void 0 : file.filename));
    const logoPath = path_1.default.join("restaurant", logo === null || logo === void 0 ? void 0 : logo.filename);
    req.body.images = imagePaths ? imagePaths : [];
    req.body.logo = logoPath ? logoPath : null;
    req.body.userId = "0f0f8456-a809-407c-9540-2cc5172aa8de";
    const response = yield restaurants.postRestaurant(req.body);
    res.status(200).json(response);
}));
//:id - restaurantId
app.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const data = yield restaurants.getRestaurant({ id });
    res.status(200).json(data);
}));
app.get("/list", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const userId = user === null || user === void 0 ? void 0 : user.id;
    let response;
    const data = yield restaurants.getRestaurantsByUsers({ userId });
    response = {
        data: data,
        newToken: req.newToken ? req.newToken : null,
    };
    res.status(200).json(response);
}));
app.get("/list/:softwareId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { softwareId } = req.params;
    const response = yield restaurants.getRestaurants({ softwareId });
    res.status(200).json(response);
}));
app.patch("/update/", auth_1.auth, storage_1.restaurantUpload.array("images"), storage_1.restaurantUpload.single("logo"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const images = req.files;
    const logo = req.file;
    const imagePaths = images.map((file) => path_1.default.join("images", file.filename));
    const logoPath = path_1.default.join("images", logo.filename);
    req.body.images = imagePaths;
    req.body.logo = logoPath;
    const data = restaurants.updateRestaurant(req.body);
    res.status(200).json(data);
}));
/**
 * @TODO - Searching of Restaurants
 */
// app.get("/restaurants/search", async (req: Request, res: Response) => {
//   const { name, city, state, rating, cuisineType, acceptingOrders } = req.query;
//   const data = await restaurants.getSearchRestaurants({ name, city, state, rating, cuisineType, acceptingOrders });
// });
exports.default = app;
//# sourceMappingURL=restaurants.js.map