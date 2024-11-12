"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cart = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const menu_schema_1 = require("./menu_schema");
const users_schema_1 = require("./users_schema");
exports.cart = (0, pg_core_1.pgTable)("cart", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom().notNull(),
    userId: (0, pg_core_1.uuid)("user_id")
        .notNull()
        .references(() => users_schema_1.users.id),
    itemId: (0, pg_core_1.uuid)("item_id")
        .notNull()
        .references(() => menu_schema_1.menu.id),
    quantity: (0, pg_core_1.smallint)("quantity").notNull().default(1),
    finalPrice: (0, pg_core_1.real)("final_price"),
});
//# sourceMappingURL=cart_schema.js.map