"use strict";
//placing orders -> user
//getting list of orders of a user -> user or admin
//details of a order -> user or admin
//getting list of all the orders with sorting capability
//getting total revenue of the orders
//getting total number of orders
//getting who is ordered what in latest and their review.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const services_1 = require("../services");
const auth_1 = require("./middlewares/auth");
const http_1 = __importDefault(require("http"));
const ws_1 = require("ws");
const url_1 = __importDefault(require("url"));
const app = (0, express_1.default)();
const orders = new services_1.Orders();
const server = http_1.default.createServer(app);
const wss = new ws_1.WebSocketServer({ noServer: true });
const clients = new Map();
console.log("HERE");
server.on("upgrade", (req, socket, head) => {
    var _a;
    console.log("UPgrade");
    const endpoint = (_a = req.url) === null || _a === void 0 ? void 0 : _a.split("?")[0];
    if (endpoint === "/order-status") {
        wss.handleUpgrade(req, socket, head, (ws) => {
            wss.emit("connection", ws, req);
        });
    }
    else {
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
wss.on("connection", (ws, req) => {
    console.log("connected bro");
    const params = url_1.default.parse(req.url, true).query;
    const orderId = params.orderId;
    ws.on("open", () => {
        console.log("Client connected");
    });
    ws.on("message", (data) => {
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
function sendOrderUpdate(orderId, message) {
    const client = clients.get(orderId);
    if (client) {
        client.send(JSON.stringify({ orderStatus: message }));
    }
}
// Define the types for `req.files` fields
app.post("/place-order", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const response = yield orders.postOrder(Object.assign({ userId }, req.body));
    res.status(200).json(response);
}));
app.get("/my-orders", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    // const response = await orders.postOrder({ userId, ...req.body });
    const response = yield orders.getOrdersByUser({ userId });
    res.status(200).json(response);
}));
app.post("/update-order-status", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const response = yield orders.updateOrderStatus({
        orderStatus: req.body.orderStatus,
        orderId: req.body.orderId,
    });
    sendOrderUpdate(req.body.orderId, req.body.orderStatus);
    res.status(200).json(response);
}));
app.get("/pending-order-details", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const response = yield orders.getPendingOrderDetails({ userId: userId });
    res.status(200).json(response);
}));
app.get("/order-status", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield orders.getOrderStatus({ orderId: req.body.orderId });
    res.status(200).json(response);
}));
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
server.listen(3000, () => { });
exports.default = app;
//# sourceMappingURL=orders.js.map