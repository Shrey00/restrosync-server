"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orders = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const users_schema_1 = require("./users_schema");
const address_schema_1 = require("./address_schema");
exports.orders = (0, pg_core_1.pgTable)("orders", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom().notNull(),
    orderId: (0, pg_core_1.varchar)("order_id", { length: 300 }),
    customerId: (0, pg_core_1.uuid)("customer_id").references(() => users_schema_1.users.id, {
        onDelete: "no action",
    }),
    taxes: (0, pg_core_1.real)("taxes"),
    deliveryCharges: (0, pg_core_1.real)("delivery_charges"),
    deleted: (0, pg_core_1.boolean)("deleted").default(false),
    totalAmount: (0, pg_core_1.real)("total_amount"),
    paymentMethod: (0, pg_core_1.varchar)("payment_method", { length: 50 })
        .$type()
        .notNull(),
    paymentStatus: (0, pg_core_1.varchar)("payment_status", { length: 50 }).$type(),
    deliveryStatus: (0, pg_core_1.varchar)("delivery_status", { length: 50 }).$type(),
    scheduledOrder: (0, pg_core_1.boolean)("scheduled_order").default(false), // use expected delivery time for schedule
    scheduledAt: (0, pg_core_1.timestamp)("scheduled_at", {
        withTimezone: true,
        precision: 3,
    }).notNull(),
    address: (0, pg_core_1.uuid)("address").references(() => address_schema_1.address.id),
    createdAt: (0, pg_core_1.timestamp)("order_time", {
        withTimezone: true,
        precision: 3,
    })
        .defaultNow()
        .notNull(),
});
//# sourceMappingURL=orders_schema.js.map