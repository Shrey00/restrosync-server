"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.offers = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const users_schema_1 = require("./users_schema");
const menu_schema_1 = require("./menu_schema");
const categories_schema_1 = require("./categories_schema");
exports.offers = (0, pg_core_1.pgTable)("offers", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom().notNull(),
    image: (0, pg_core_1.text)("image"),
    customerId: (0, pg_core_1.uuid)("customer_id").references(() => users_schema_1.users.id),
    offerName: (0, pg_core_1.varchar)("offer_name", { length: 250 }),
    discount: (0, pg_core_1.smallint)("discount").notNull(),
    freeItem: (0, pg_core_1.uuid)("free_item").references(() => menu_schema_1.menu.id),
    startTime: (0, pg_core_1.timestamp)("start_time", {
        withTimezone: true,
        precision: 3,
    }).notNull(),
    endTime: (0, pg_core_1.timestamp)("end_time", {
        withTimezone: true,
        precision: 3,
    }).notNull(),
    maxDiscountAmount: (0, pg_core_1.smallint)("max_discount_amount").notNull(),
    minOrderValue: (0, pg_core_1.smallint)("max_discount_amount").notNull(),
    maxUsage: (0, pg_core_1.smallint)("max_usage").notNull(),
    usage: (0, pg_core_1.smallint)("usage").notNull(),
    couponCode: (0, pg_core_1.varchar)("coupon_code", { length: 16 }),
    category: (0, pg_core_1.integer)("category").references(() => categories_schema_1.categories.id),
    createdAt: (0, pg_core_1.timestamp)("created_at", {
        withTimezone: true,
        precision: 3,
    })
        .defaultNow()
        .notNull(),
});
//# sourceMappingURL=offers_schema.js.map