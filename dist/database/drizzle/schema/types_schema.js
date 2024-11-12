"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.types = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
//   import { type } from "./types_schema";
exports.types = (0, pg_core_1.pgTable)("types", {
    id: (0, pg_core_1.serial)("id").primaryKey().notNull(),
    name: (0, pg_core_1.varchar)("name", { length: 50 }),
});
//# sourceMappingURL=types_schema.js.map