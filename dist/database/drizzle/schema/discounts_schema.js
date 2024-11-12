"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.discounts = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const restaurants_schema_1 = require("./restaurants_schema");
const users_schema_1 = require("./users_schema");
exports.discounts = (0, pg_core_1.pgTable)("discounts", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom().notNull(),
    customerId: (0, pg_core_1.uuid)("customer_id").references(() => users_schema_1.users.id),
    restaurantId: (0, pg_core_1.uuid)("restaurant_id").references(() => restaurants_schema_1.restaurants.id),
    validFrom: (0, pg_core_1.timestamp)("valid_from", {
        withTimezone: true,
        precision: 3,
    }),
    validTill: (0, pg_core_1.timestamp)("valid_till", {
        withTimezone: true,
        precision: 3,
    }),
    couponCode: (0, pg_core_1.text)("coupon_code"),
    percentage: (0, pg_core_1.real)("percentage"),
    maxDiscountAmount: (0, pg_core_1.real)("max_discount_amount"),
    createdAt: (0, pg_core_1.timestamp)("order_time", {
        withTimezone: true,
        precision: 3,
    }).defaultNow(),
});
//# sourceMappingURL=discounts_schema.js.map