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
import express from "express";
import { Menu, Orders } from "../services";
import { Restaurant } from "../types";
import { auth } from "./middlewares/auth";
import path, { format } from "path";
import { menuUpload as upload } from "./middlewares/storage";
import { JwtConfig, JwtPayloadData } from "../types";
import { Jwt, JwtPayload } from "jsonwebtoken";
import formatResponse from "../utils/formatResponse";
import http from "http";
import Websocket, { WebSocketServer } from "ws";
import url from "url";
const app = express();
const orders = new Orders();
const server = http.createServer(app);
const wss = new WebSocketServer({ noServer: true });
const clients = new Map();
console.log("HERE");
server.on("upgrade", (req, socket, head) => {
  console.log("UPgrade");
  const endpoint = req.url?.split("?")[0];
  if (endpoint === "/order-status") {
    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit("connection", ws, req);
    });
  } else {
    socket.destroy();
  }
});

// type OrderStatus = {
//   orderId: string;
//   totalAmount: number;
//   restaurantName: string;
//   deliveryStatus: string;
//   createdAt: string;
//   orderItems: {
//     name: string;
//     cuisineType: string;
//     status: string;
//     quantity: string;
//     amount: string;
//   }[];
// };
wss.on("connection", (ws: Websocket, req) => {
  console.log("connected bro");
  const params = url.parse(req.url!, true).query;
  const orderId = params.orderId as string;
  ws.on("open", () => {
    console.log("Client connected");
  });
  ws.on("message", (data: string) => {
    const message = JSON.parse(data);
    switch (message.type) {
      case "join":
        clients.set(orderId, ws);
        break;
    }
    console.log("Recieved: %s", message);
  });
  ws.on("error", (err) => {
    console.log(err);
  });
  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

function sendOrderUpdate(orderId: string, message: string) {
  const client = clients.get(orderId);
  if (client) {
    client.send(JSON.stringify({ orderStatus: message }));
  }
}
// Define the types for `req.files` fields
app.post("/place-order", auth, async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const response = await orders.postOrder({ userId, ...req.body });
  res.status(200).json(response);
});

app.get("/my-orders", auth, async (req: Request, res: Response) => {
  const userId = req.user?.id;
  // const response = await orders.postOrder({ userId, ...req.body });
  const response = await orders.getOrdersByUser({ userId });
  res.status(200).json(response);
});

app.post("/update-order-status", auth, async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const response = await orders.updateOrderStatus({
    orderStatus: req.body.orderStatus,
    orderId: req.body.orderId,
  });
  sendOrderUpdate(req.body.orderId, req.body.orderStatus);
  res.status(200).json(response);
});

app.get("/pending-order-details", auth, async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const response = await orders.getPendingOrderDetails({ userId: userId! });
  res.status(200).json(response);
});

app.get("/order-status", auth, async (req: Request, res: Response) => {
  const response = await orders.getOrderStatus({ orderId: req.body.orderId });
  res.status(200).json(response);
});

// server.listen(3000, () => {
//   console.log("Server running on http://localhost:3000");
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
server.listen(3000, () => {});
export default app;
