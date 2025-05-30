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

import { Request, Response } from "express";
import express from "express";
import { Menu, Orders } from "../services";
import { Restaurant } from "../types";
import { auth } from "./middlewares/auth";
import { distance } from "../utils/calculateDistance";
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
        console.log("client-joined", orderId);
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
  console.log(orderId);
  const client = clients.get(orderId);
  console.log("Thats client");
  console.log(client);
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

app.post("/restaurant-orders", auth, async (req: Request, res: Response) => {
  const restaurantId = req.body?.restaurantId;
  // const response = await orders.postOrder({ userId, ...req.body });
  const response = await orders.getOrdersByRestaurant({
    restaurantId,
    queryParams: req.query,
  });
  res.status(200).json(response);
});

app.patch("/update-order-status", auth, async (req: Request, res: Response) => {
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

app.get("/order-items", auth, async (req: Request, res: Response) => {
  const { orderId } = req.query;
  const response = await orders.getOrderItems({ orderId: orderId as string });
  res.status(200).json(response);
});

interface DistanceQuery {
  lat1: string;
  lon1: string;
  lat2: string;
  lon2: string;
}
app.get("/delivery-details", auth, async (req: Request, res: Response) => {
  // const { orderId } = req.query;
  // const response = await orders.getOrderItems();
  const MAX_DISTANCE = 20000;
  const query = req.query as any;
  const fromLocation: [number, number] = [
    parseFloat(query.lat1),
    parseFloat(query.lon1),
  ];
  const toLocation: [number, number] = [
    parseFloat(query.lat2),
    parseFloat(query.lon2),
  ];

  const distanceInMeters = distance(fromLocation, toLocation);
  let deliveryAmount = 10;
  if (distanceInMeters <= 2500) {
    deliveryAmount = 10;
  } else if (distanceInMeters <= 5000) {
    deliveryAmount = 20;
  } else if (distanceInMeters <= 7500) {
    deliveryAmount = 30;
  } else if (distanceInMeters <= 10000) {
    deliveryAmount = 40;
  } else if (distanceInMeters <= 15000) {
    deliveryAmount = 50;
  } else if (distanceInMeters <= 20000) {
    deliveryAmount = 60;
  } else {
    deliveryAmount = 0;
  }
  const response = {
    distance: distanceInMeters,
    unit: "meters",
    deliveryAvailable: distanceInMeters <= MAX_DISTANCE ? true : false,
    deliveryAmount,
  };

  res.status(200).json(response);
});

app.patch(
  "/order-item/set-status",
  auth,
  async (req: Request, res: Response) => {
    const response = await orders.setOrderItemStatus({
      orderItemId: req.body.orderItemId,
      status: req.body.status,
    });
    res.status(200).json(response);
  }
);

// server.listen(3000, () => {
//   console.log("Server running on http://localhost:3000");
// });
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
//     const data = restaurants.updateRestaurant(req.body);
//     res.status(200).json(data);
//   }
// );
server.listen(3000, () => {});
export default app;
