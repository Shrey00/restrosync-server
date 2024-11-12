"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.menu = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const restaurants_schema_1 = require("./restaurants_schema");
const categories_schema_1 = require("./categories_schema");
const types_schema_1 = require("./types_schema");
exports.menu = (0, pg_core_1.pgTable)("menu", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom().notNull(),
    restaurantId: (0, pg_core_1.uuid)("restaurant_id")
        .notNull()
        .references(() => restaurants_schema_1.restaurants.id),
    name: (0, pg_core_1.varchar)("name", { length: 250 }).notNull(),
    category: (0, pg_core_1.integer)("category").references(() => categories_schema_1.categories.id),
    type: (0, pg_core_1.integer)("type").references(() => types_schema_1.types.id),
    available: (0, pg_core_1.boolean)("available"),
    cuisineType: (0, pg_core_1.varchar)("cusine_type", { length: 15 }).notNull(),
    orders: (0, pg_core_1.integer)("orders").notNull().default(0),
    description: (0, pg_core_1.text)("description"),
    rating: (0, pg_core_1.real)("rating"),
    reviewSummary: (0, pg_core_1.text)("reviewSummary"),
    discount: (0, pg_core_1.smallint)("discount"),
    markedPrice: (0, pg_core_1.real)("marked_price"),
    sellingPrice: (0, pg_core_1.real)("selling_price"),
    variant: (0, pg_core_1.varchar)("variant", { length: 6 }).$type(),
    calories: (0, pg_core_1.smallint)("calories"),
    healthScore: (0, pg_core_1.smallint)("healthScore"),
    showHealthInfo: (0, pg_core_1.boolean)("show_healthinfo"),
    images: (0, pg_core_1.json)("images").$type().default([]),
    createdAt: (0, pg_core_1.timestamp)("created_at", {
        withTimezone: true,
        precision: 3,
    })
        .notNull()
        .defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at", {
        withTimezone: true,
        precision: 3,
    })
        .notNull()
        .$onUpdate(() => new Date()),
});
//# sourceMappingURL=menu_schema.js.map