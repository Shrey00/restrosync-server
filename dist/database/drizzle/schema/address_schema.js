"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.address = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const users_schema_1 = require("./users_schema");
exports.address = (0, pg_core_1.pgTable)("address", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom().notNull(),
    userId: (0, pg_core_1.uuid)("user_id").references(() => users_schema_1.users.id, {
        onDelete: "no action",
    }),
    address_line_1: (0, pg_core_1.text)("address_line_1"),
    address_line_2: (0, pg_core_1.text)("address_line_2"),
    city: (0, pg_core_1.text)("city").notNull(),
    state: (0, pg_core_1.text)("state").notNull(),
    country: (0, pg_core_1.text)("country").notNull(),
    postalCode: (0, pg_core_1.text)("postal_code").notNull(),
    location: (0, pg_core_1.point)("point", { mode: "xy" }),
    type: (0, pg_core_1.varchar)("type", { length: 40 }).$type(),
    selected: (0, pg_core_1.boolean)("selected").default(false),
});
//# sourceMappingURL=address_schema.js.map