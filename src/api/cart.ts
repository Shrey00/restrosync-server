//get the menu of a restaurant
//add or delete item from a restaurant -> priviledge: Admin
//update menu item ->priviledge: Admin

import { NextFunction, Request, response, Response } from "express";
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

app.post("/add-to-cart", auth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { menuItemId } = req.body;
    const userId = req.user?.id;
    const response = await cart.postCartItem({ menuItemId, userId });
    res.status(200).json(response);
  } catch (e) {
    next(e);
  }
});
app.get("/get-cart-items", auth, async (req: Request, res: Response) => {
  const response = await cart.getCartItems({
    ...req.body,
    userId: req.user?.id,
  });
  const formattedResponse = formatResponse(req.newToken, response);
  res.status(200).json(formattedResponse);
});
app.patch("/update-quantity", auth, async (req: Request, res: Response) => {
  const response = await cart.patchQuantity({
    itemId: req.body.itemId,
    quantity: req.body.quantity,
  });
  res.status(200).json(response);
});
app.delete(
  "/delete",
  auth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await cart.deleteCartItem({
        itemId: req.body.itemId,
      });
    } catch (e) {
      next(e);
    }
    res.status(200).json(response);
  }
);
app.delete(
  "/delete-all",
  auth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await cart.deleteAllCartItems({
        userId: req.user?.id!
      });
    } catch (e) {
      next(e);
    }
    res.status(200).json(response);
  }
);

export default app;
