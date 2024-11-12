import { Request, response, Response } from "express";
import { Router } from "express";
import { Restaurants } from "../services";
import { Restaurant } from "../types";
import { auth } from "./middlewares/auth";
import path from "path";
import { restaurantUpload as upload } from "./middlewares/storage";
import { JwtConfig, JwtPayloadData } from "../types";
import { Jwt, JwtPayload } from "jsonwebtoken";
import formatResponse from "../utils/formatResponse";

const app = Router();
const restaurants = new Restaurants();
// Define the types for `req.files` fields
app.post(
  "/create",
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]),
  async (req: Request, res: Response) => {
    const files = req.files as any;
    const images = files?.images;
    const logo = files?.logo ? files.logo[0] : null;
    const imagePaths = images.map((file: any) =>
      path.join("restaurant", file?.filename)
    );
    const logoPath = path.join("restaurant", logo?.filename);
    req.body.images = imagePaths ? imagePaths : [];
    req.body.logo = logoPath ? logoPath : null;
    req.body.userId = "0f0f8456-a809-407c-9540-2cc5172aa8de";
    const response = await restaurants.postRestaurant(req.body);
    res.status(200).json(response);
  }
);

//:id - restaurantId
app.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = await restaurants.getRestaurant({ id });
  res.status(200).json(data);
});

app.get("/list", auth, async (req: Request, res: Response) => {
  const user = req.user;
  const userId = user?.id;
  let response: { data: Array<Restaurant>; newToken?: null | string };
  const data = await restaurants.getRestaurantsByUsers({ userId });
  response = {
    data: data,
    newToken: req.newToken ? req.newToken : null,
  };
  res.status(200).json(response);
});
app.get("/list/:softwareId", async (req: Request, res: Response) => {
  const { softwareId } = req.params;
  const response = await restaurants.getRestaurants({ softwareId });
  res.status(200).json(response);
});

app.patch(
  "/update/",
  auth,
  upload.array("images"),
  upload.single("logo"),
  async (req: Request, res: Response) => {
    const images = req.files as Express.Multer.File[];
    const logo = req.file as Express.Multer.File;
    const imagePaths = images.map((file) => path.join("images", file.filename));
    const logoPath = path.join("images", logo.filename);
    req.body.images = imagePaths;
    req.body.logo = logoPath;
    const data = restaurants.updateRestaurant(req.body);
    res.status(200).json(data);
  }
);
/**
 * @TODO - Searching of Restaurants
 */
// app.get("/restaurants/search", async (req: Request, res: Response) => {
//   const { name, city, state, rating, cuisineType, acceptingOrders } = req.query;
//   const data = await restaurants.getSearchRestaurants({ name, city, state, rating, cuisineType, acceptingOrders });
// });
export default app;
