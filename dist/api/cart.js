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
const auth_1 = require("./middlewares/auth");
const formatResponse_1 = __importDefault(require("../utils/formatResponse"));
const app = (0, express_1.Router)();
const cart = new services_1.Cart();
app.post("/add-to-cart", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { itemId } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const response = yield cart.postCartItem({ itemId, userId });
    const formattedResponse = (0, formatResponse_1.default)(req.newToken, response);
    res.status(200).json(formattedResponse);
}));
app.get("/get-cart-items", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const response = yield cart.getCartItems(Object.assign(Object.assign({}, req.body), { userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id }));
    const formattedResponse = (0, formatResponse_1.default)(req.newToken, response);
    res.status(200).json(formattedResponse);
}));
// app.post("/add-category", async (req: Request, res: Response) => {
//   const response = await menu.postCategoryUnderAType(req.body);
//   console.log(response);
//   const formattedResponse = formatResponse(req.newToken, response);
//   res.status(200).json(formattedResponse);
// });
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
//# sourceMappingURL=cart.js.map