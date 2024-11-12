"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deliveries = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const users_schema_1 = require("./users_schema");
const orders_schema_1 = require("./orders_schema");
const address_schema_1 = require("./address_schema");
exports.deliveries = (0, pg_core_1.pgTable)("deliveries", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom().notNull(),
    orderId: (0, pg_core_1.uuid)("order_id").references(() => orders_schema_1.orders.id),
    deliveryPartnerId: (0, pg_core_1.uuid)("delivery_partner_id").references(() => users_schema_1.users.id),
    status: (0, pg_core_1.varchar)("status", { length: 50 }).$type(),
    address: (0, pg_core_1.uuid)("address").references(() => address_schema_1.address.id),
    assignedAt: (0, pg_core_1.timestamp)("assigned_at", { withTimezone: true, precision: 3 }),
    pickedUpAt: (0, pg_core_1.timestamp)("pickedup_at", { withTimezone: true, precision: 3 }),
    estimatedDeliveryTime: (0, pg_core_1.timestamp)("estimated_delivery_time", {
        withTimezone: true,
        precision: 3,
    }).notNull(),
    deliveredAt: (0, pg_core_1.timestamp)("delivered_at", { withTimezone: true, precision: 3 }),
    deliveryNotes: (0, pg_core_1.text)("delivery_notes"),
    location_coordinates: (0, pg_core_1.json)("location_coordinates")
        .$type()
        .default({
        latitude: "",
        longitude: "",
    }),
});
//# sourceMappingURL=deliveries_schema.js.map