import express, { Request, Response } from "express";
import "dotenv/config";
import db from "./database/connection";
import { Users } from './services/users';
import { users as userSchema } from './database/drizzle/schema/users_schema';
import { eq, sql, } from 'drizzle-orm';
import cors from 'cors';
import { userRoutes } from "./api";
const app = express();
// import { Users } from './database/drizzle/db_schema';

app.use(cors({ exposedHeaders: 'Authorization' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', userRoutes)
const PORT = process.env.PORT ? process.env.PORT : 3000;

app.listen(PORT, () => {
  console.log("server listening at " + PORT);
});



//Users
//Restaurants and Menu, Sales and Orders, Cart, Delivery, Dashboard
