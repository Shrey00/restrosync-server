/**
 * @TODO - Implement Error handling with best practices
 * @TODO - Make the code more typesafe
 */

import express, { NextFunction, Request, Response } from "express";
import "dotenv/config";
import path from "path";
import cors from "cors";
import {
  addressRoutes,
  cartRoutes,
  menuRoutes,
  restaurantRoutes,
  userRoutes,
  orderRoutes,
} from "./api";
import { AppError } from "./utils/ErrorHandler";
import cookieParser from "cookie-parser";
// const envFile = process.env.NODE_ENV === 'development' ? '.env.development' : '.env.development';
// dotenv.config({ path: envFile });

const app = express();

//Middlwares

app.use(cookieParser());
app.use(
  cors((req, callback) => {
    const allowedOrigins = [
      "https://restrosync.zyptec.com",
      "http://localhost:3001",
    ]; // Add any other specific domains if needed
    const origin = req.header("Origin");

    // Default options
    let corsConfig = {
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
      allowedHeaders: ["Content-Type", "Authorization"],
      origin: true,
      credentials: false,
    };
    if (origin && allowedOrigins.includes(origin)) {
      corsConfig.credentials = true;
    }
    callback(null, corsConfig);
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/", express.static("assets"));
// app.use("/assets", express.static(path.join(__dirname, "assets", "menu")));
//Routes
app.use("/", userRoutes);
app.use("/restaurants", restaurantRoutes);
app.use("/menu", menuRoutes);
app.use("/orders", orderRoutes);
app.use("/address", addressRoutes);
app.use("/cart", cartRoutes);

app.use((err: AppError, req: Request, res: Response, next: NextFunction) => {
  console.log(err);
  res
    .status(err.httpCode)
    .json({ statusCode: err.httpCode, name: err.name, desc: err.description });
});

const PORT = 4000;

app.listen(PORT, () => {
  console.log("server listening at " + PORT);
});
