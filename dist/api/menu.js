"use strict";
//get the menu of a restaurant
//add or delete item from a restaurant -> priviledge: Admin
//update menu item ->priviledge: Admin
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
const path_1 = __importDefault(require("path"));
const storage_1 = require("./middlewares/storage");
const formatResponse_1 = __importDefault(require("../utils/formatResponse"));
const app = (0, express_1.Router)();
const menu = new services_1.Menu();
// Define the types for `req.files` fields
app.get("/get-menu-categories", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield menu.getMenuCategoriesAndType();
    const formattedResponse = (0, formatResponse_1.default)(req.newToken, response);
    res.status(200).json(formattedResponse);
}));
app.post("/item/variants", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { menuItemId } = req.body;
        const response = yield menu.getMenuVariants({ menuItemId });
        const formattedResponse = (0, formatResponse_1.default)(req.newToken, response);
        res.status(200).json(formattedResponse);
    }
    catch (e) {
        next(e);
    }
}));
app.post("/add-item", storage_1.menuUpload.array("images"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const images = req.files;
    const imagePaths = images === null || images === void 0 ? void 0 : images.map((file) => path_1.default.join("menu_item", file === null || file === void 0 ? void 0 : file.filename));
    req.body.images = imagePaths ? imagePaths : [];
    req.body.userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const response = yield menu.postMenuItem(req.body);
    const formattedResponse = (0, formatResponse_1.default)(req.newToken, response);
    res.status(200).json(formattedResponse);
}));
app.post("/item/add-variants", storage_1.menuUpload.array("images"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const images = req.files;
    const imagePaths = images === null || images === void 0 ? void 0 : images.map((file) => path_1.default.join("menu_item", file === null || file === void 0 ? void 0 : file.filename));
    const response = yield menu.postMenuVariants(req.body);
    const formattedResponse = (0, formatResponse_1.default)(req.newToken, response);
    res.status(200).json(formattedResponse);
}));
app.delete("/:menuItemId/delete", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield menu.deleteMenuItem(req.params);
    res.status(200).json({ message: "Menu Item deleted successfully." });
}));
app.post("/items", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield menu.getMenuItems(req.body, req.query);
        const formattedResponse = (0, formatResponse_1.default)(req.newToken, response);
        res.status(200).json(formattedResponse);
    }
    catch (e) {
        next(e);
    }
}));
app.post("/category-wise-items", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield menu.getMenuItemsCategoryWise(req.body, req.query);
        const formattedResponse = (0, formatResponse_1.default)(req.newToken, response);
        res.status(200).json(formattedResponse);
    }
    catch (e) {
        next(e);
    }
}));
app.post("/add-category", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield menu.postCategoryUnderAType(req.body);
    const formattedResponse = (0, formatResponse_1.default)(req.newToken, response);
    res.status(200).json(formattedResponse);
}));
app.get("/popular-items/:softwareId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield menu.getTopTenItemsByOrders({
        softwareId: req.params.softwareId,
    });
    console.log("THSI IS IT");
    console.log(response);
    res.status(200).json(response);
}));
app.get("/search", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield menu.search(req.query);
    res.status(200).json(response);
}));
// // URL - menu/restaurantId
// app.get("/", async (req: Request, res: Response) => {
//   const { restaurantId } = req.body;
//   let response = await menu.getMenuItems({ restaurantId });
//   response = formatResponse(req.newToken, response)
//   res.status(200).json(response);
// });
// app.patch(
//   "/update/",
//   auth,
//   upload.array("images"),
//   upload.single("logo"),
//   async (req: Request, res: Response) => {
//     const images = req.files as Express.Multer.File[];
//     const logo = req.file as Express.Multer.File;
//     const imagePaths = images.map((file) => path.join("images", file.filename));
//     const logoPath = path.join("images", logo.filename);
//     req.body.images = imagePaths;
//     req.body.logo = logoPath;
//     // req.body.userId = req.user;
//     const data = restaurants.updateRestaurant(req.body);
//     res.status(200).json(data);
//   }
// );
exports.default = app;
//# sourceMappingURL=menu.js.map