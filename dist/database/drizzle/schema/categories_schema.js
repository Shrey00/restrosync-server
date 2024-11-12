"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categories = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const types_schema_1 = require("./types_schema");
exports.categories = (0, pg_core_1.pgTable)("categories", {
    id: (0, pg_core_1.serial)("id").primaryKey().notNull(),
    name: (0, pg_core_1.varchar)("name", { length: 50 }),
    image: (0, pg_core_1.text)("image"),
    type: (0, pg_core_1.serial)("type").references(() => types_schema_1.types.id),
});
//# sourceMappingURL=categories_schema.js.map