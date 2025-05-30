//get the menu of a restaurant
//add or delete item from a restaurant -> priviledge: Admin
//update menu item ->priviledge: Admin

import { Request, response, Response } from "express";
import { Router } from "express";
import { Address } from "../services";
import { auth } from "./middlewares/auth";
import formatResponse from "../utils/formatResponse";

const app = Router();
const address = new Address();

app.post("/add-address", auth, async (req: Request, res: Response) => {
  req.body.userId = req.user?.id;
  // req.body.restaurants
  const response = await address.postAddress(req.body);
  const formattedResponse = formatResponse(req.newToken, response);
  res.status(200).json(formattedResponse);
});
app.post("/update-address", auth, async (req: Request, res: Response) => {
  const response = await address.patchAddress(req.body);
  const formattedResponse = formatResponse(req.newToken, response);
  res.status(200).json(formattedResponse);
});
app.get("/get-addresses", auth, async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const response = await address.getAddresses({ userId: userId as string });
  const formattedResponse = formatResponse(req.newToken, response);
  res.status(200).json(formattedResponse);
});
app.patch(
  "/update-selected-address",
  auth,
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const response = await address.patchSelectedAddress({
      addressId: req.body.addressId as string,
      userId: userId as string,
    });
    const formattedResponse = formatResponse(req.newToken, response);
    res.status(200).json(formattedResponse);
  }
);
export default app;
