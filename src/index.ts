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
  orderRoutes
} from "./api";
import { AppError, handler } from "./utils/ErrorHandler";
import cookieParser from "cookie-parser";

// const envFile = process.env.NODE_ENV === 'development' ? '.env.development' : '.env.development';
// dotenv.config({ path: envFile });

const app = express();

//Middlwares
app.use("/assets", express.static(path.join(__dirname, "assets")));
app.use(cookieParser());
app.use(
  cors({
    exposedHeaders: "Authorization",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    origin: "http://localhost:3000",
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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

const PORT =  4000;
app.listen(PORT, () => {
  console.log("server listening at " + PORT);
});

