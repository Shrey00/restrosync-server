//get the menu of a restaurant
//add or delete item from a restaurant -> priviledge: Admin
//update menu item ->priviledge: Admin

import { Request, response, Response } from "express";
import { Router } from "express";
import { Cart } from "../services";
import { Restaurant } from "../types";
import { auth } from "./middlewares/auth";
import path, { format } from "path";
import { menuUpload as upload } from "./middlewares/storage";
import { JwtConfig, JwtPayloadData } from "../types";
import { Jwt, JwtPayload } from "jsonwebtoken";
import formatResponse from "../utils/formatResponse";

const app = Router();
const cart = new Cart();

app.post("/add-to-cart", auth, async (req: Request, res: Response) => {
  const { itemId } = req.body;
  const userId  = req.user?.id;
  const response = await cart.postCartItem({itemId, userId});
  const formattedResponse = formatResponse(req.newToken, response);
  res.status(200).json(formattedResponse);
});
app.get("/get-cart-items", auth, async (req: Request, res: Response) => {
  const response = await cart.getCartItems({...req.body, userId: req.user?.id});
  const formattedResponse = formatResponse(req.newToken, response);
  res.status(200).json(formattedResponse);
});

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
export default app;
