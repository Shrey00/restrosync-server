//get the menu of a restaurant
//add or delete item from a restaurant -> priviledge: Admin
//update menu item ->priviledge: Admin

import { NextFunction, Request, response, Response } from "express";
import { Router } from "express";
import { Menu } from "../services";
import path, { format } from "path";
import { menuUpload as upload } from "./middlewares/storage";
import formatResponse from "../utils/formatResponse";

const app = Router();
const menu = new Menu();
// Define the types for `req.files` fields

app.get("/get-menu-categories", async (req: Request, res: Response) => {
  const response = await menu.getMenuCategoriesAndType();
  const formattedResponse = formatResponse(req.newToken, response);
  res.status(200).json(formattedResponse);
});

app.post(
  "/item/variants",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { menuItemId } = req.body;
      const response = await menu.getMenuVariants({ menuItemId });
      const formattedResponse = formatResponse(req.newToken, response);
      res.status(200).json(formattedResponse);
    } catch (e) {
      next(e);
    }
  }
);

app.post(
  "/add-item",
  upload.array("images"),
  async (req: Request, res: Response) => {
    const images = req.files as any;
    const imagePaths = images?.map((file: any) =>
      path.join("menu_item", file?.filename)
    );
    req.body.images = imagePaths ? imagePaths : [];
    req.body.userId = req.user?.id;
    const response: { id: string }[] = await menu.postMenuItem(req.body);
    const formattedResponse = formatResponse(req.newToken, response);
    res.status(200).json(formattedResponse);
  }
);

app.post(
  "/item/add-variants",
  upload.array("images"),
  async (req: Request, res: Response) => {
    const images = req.files as any;
    const imagePaths = images?.map((file: any) =>
      path.join("menu_item", file?.filename)
    );
    const response = await menu.postMenuVariants(req.body);
    const formattedResponse = formatResponse(req.newToken, response);
    res.status(200).json(formattedResponse);
  }
);

app.delete("/:menuItemId/delete", async (req: Request, res: Response) => {
  const response = await menu.deleteMenuItem(req.params);
  res.status(200).json({ message: "Menu Item deleted successfully." });
});

app.post("/items", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await menu.getMenuItems(req.body, req.query);
    const formattedResponse = formatResponse(req.newToken, response);
    res.status(200).json(formattedResponse);
  } catch (e) {
    next(e);
  }
});
app.post("/item", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await menu.getMenuItem(req.body);
    res.status(200).json(response);
  } catch (e) {
    next(e);
  }
});
app.post(
  "/category-wise-items",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await menu.getMenuItemsCategoryWise(req.body, req.query);
      const formattedResponse = formatResponse(req.newToken, response);
      res.status(200).json(formattedResponse);
    } catch (e) {
      next(e);
    }
  }
);
app.post("/add-category", async (req: Request, res: Response) => {
  const response = await menu.postCategoryUnderAType(req.body);
  const formattedResponse = formatResponse(req.newToken, response);
  res.status(200).json(formattedResponse);
});
app.get("/popular-items/:softwareId", async (req: Request, res: Response) => {
  const response = await menu.getTopTenItemsByOrders({
    softwareId: req.params.softwareId,
  });
  console.log(response)
  res.status(200).json(response);
});
app.get("/search", async (req: Request, res: Response) => {
  const response = await menu.search(req.query);
  res.status(200).json(response);
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
