//placing orders -> user
//getting list of orders of a user -> user or admin
//details of a order -> user or admin
//getting list of all the orders with sorting capability
//getting total revenue of the orders
//getting total number of orders
//getting who is ordered what in latest and their review.

//get the menu of a restaurant
//add or delete item from a restaurant -> priviledge: Admin
//update menu item ->priviledge: Admin

import { Request, response, Response } from "express";
import { Router } from "express";
import { Menu, Orders } from "../services";
import { Restaurant } from "../types";
import { auth } from "./middlewares/auth";
import path, { format } from "path";
import { menuUpload as upload } from "./middlewares/storage";
import { JwtConfig, JwtPayloadData } from "../types";
import { Jwt, JwtPayload } from "jsonwebtoken";
import formatResponse from "../utils/formatResponse";

const app = Router();
const orders = new Orders();
// Define the types for `req.files` fields
app.post("/place-order", auth, async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const response = await orders.postOrder({ userId, ...req.body });
  const formattedResponse = formatResponse(req.newToken, response);
  res.status(200).json(formattedResponse);
});

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
