"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const drizzle_kit_1 = require("drizzle-kit");
exports.default = (0, drizzle_kit_1.defineConfig)({
    schema: "src/database/drizzle/schema/*.ts",
    dialect: "postgresql",
    out: "src/database/drizzle/migrations",
    dbCredentials: {
        url: process.env.DB_URL,
    },
});
//# sourceMappingURL=drizzle.config.js.map