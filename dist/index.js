"use strict";
/**
 * @TODO - Implement Error handling with best practices
 * @TODO - Make the code more typesafe
 */
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
exports.fetchTransactionReceipt = fetchTransactionReceipt;
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const api_1 = require("./api");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
// const envFile = process.env.NODE_ENV === 'development' ? '.env.development' : '.env.development';
// dotenv.config({ path: envFile });
const app = (0, express_1.default)();
//Middlwares
app.use("/assets", express_1.default.static(path_1.default.join(__dirname, "assets")));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    exposedHeaders: "Authorization",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    origin: "http://localhost:3000",
}));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
//Routes
app.use("/", api_1.userRoutes);
app.use("/restaurants", api_1.restaurantRoutes);
app.use("/menu", api_1.menuRoutes);
app.use("/orders", api_1.orderRoutes);
app.use("/address", api_1.addressRoutes);
app.use("/cart", api_1.cartRoutes);
app.use((err, req, res, next) => {
    console.log(err);
    res
        .status(err.httpCode)
        .json({ statusCode: err.httpCode, name: err.name, desc: err.description });
});
const PORT = 4000;
function fetchTransactionReceipt(txHash) {
    return __awaiter(this, void 0, void 0, function* () {
        // const response = await fetch(
        //   "https://base-mainnet.g.alchemy.com/v2/" + process.env.ALCHEMY_API_KEY,
        //   {
        //     method: "POST",
        //     headers: {
        //       "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify({
        //       jsonrpc: "2.0",
        //       id: 1,
        //       method: "eth_getTransactionReceipt",
        //       params: [txHash],
        //     }),
        //   },
        // );
        const response = yield fetch(`https://api.simplehash.com/api/v0/fungibles/transfers/transaction/base/${txHash}`, {
            headers: {
                "X-API-KEY": process.env.SIMPLEHASH_API_KEY,
            },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = yield response.json();
        return data.transfers;
    });
}
function extractSwapDetails(transfers) {
    // Sort transfers by log_index
    const sortedTransfers = [...transfers].sort((a, b) => a.log_index - b.log_index);
    const tokenInTransfer = sortedTransfers[0];
    const tokenOutTransfer = sortedTransfers[sortedTransfers.length - 1];
    // Extract wallet address (the recipient of the output token)
    const walletAddress = tokenOutTransfer.to_address;
    return {
        fromAmount: tokenInTransfer.quantity_string,
        toAmount: tokenOutTransfer.quantity_string,
        walletAddress,
        timestamp: tokenInTransfer.timestamp,
        transactionHash: tokenInTransfer.transaction_hash,
        tokenAddress: tokenOutTransfer.fungible_id.split(".")[1],
        fromTokenAddress: tokenInTransfer.fungible_id.split(".")[1],
    };
}
function that() {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield fetchTransactionReceipt("0x95e64291786043fedd0fdcb571798c6c9a7ef790f806d3667042aab3d8360458");
        // const data = await response.json();
        console.log({ data });
        const extracted = extractSwapDetails(data);
        console.log({ extracted });
        // return response;
    });
}
that();
app.listen(PORT, () => {
    console.log("server listening at " + PORT);
});
//# sourceMappingURL=index.js.map