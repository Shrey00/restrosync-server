"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderItems = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const menu_schema_1 = require("./menu_schema");
const orders_schema_1 = require("./orders_schema");
exports.orderItems = (0, pg_core_1.pgTable)("order_items", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom().notNull(),
    orderId: (0, pg_core_1.uuid)("order_id").references(() => orders_schema_1.orders.id),
    status: (0, pg_core_1.varchar)("status", { length: 50 }).$type(),
    orderItem: (0, pg_core_1.uuid)("order_item").references(() => menu_schema_1.menu.id),
    quantity: (0, pg_core_1.smallint)("quantity").default(1),
    amount: (0, pg_core_1.real)("amount").notNull(),
    addNote: (0, pg_core_1.text)("add_note"),
});
//# sourceMappingURL=order_items_schema.js.map