"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.restaurants = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const address_schema_1 = require("./address_schema");
exports.restaurants = (0, pg_core_1.pgTable)("restaurants", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom().notNull(),
    softwareId: (0, pg_core_1.uuid)("software_id").defaultRandom().notNull(),
    name: (0, pg_core_1.varchar)("name", { length: 200 }).notNull(),
    email: (0, pg_core_1.varchar)("email", { length: 100 }).notNull().unique(),
    contact: (0, pg_core_1.varchar)("contact", { length: 20 }).notNull().unique(),
    countryCode: (0, pg_core_1.char)("country_code", { length: 3 }).default("+91"),
    description: (0, pg_core_1.text)("description"),
    rating: (0, pg_core_1.real)("rating"),
    address: (0, pg_core_1.uuid)("address").references(() => address_schema_1.address.id, {
        onDelete: "cascade",
    }),
    logo: (0, pg_core_1.text)("logo"),
    images: (0, pg_core_1.json)("images").$type().default([]),
    cuisineType: (0, pg_core_1.varchar)("cusine_type", { length: 15 }).notNull(), //veg,non-veg or multi-cuisine
    opensAt: (0, pg_core_1.time)("opens_at"),
    closesAt: (0, pg_core_1.time)("closes_at"),
    acceptingOrders: (0, pg_core_1.boolean)("accepting_orders").default(false).notNull(),
    nextOpeningTime: (0, pg_core_1.time)("next_opening_time"), //only to be used for temporary opening and closing of restaurants
    nextClosingTime: (0, pg_core_1.time)("next_closing_time"), //only to be used for temporary opening and closing of restaurants
    type: (0, pg_core_1.varchar)("type", { length: 30 }).$type(),
    createdAt: (0, pg_core_1.timestamp)("created_at", {
        withTimezone: true,
        precision: 3,
    })
        .defaultNow()
        .notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at", {
        withTimezone: true,
        precision: 3,
    })
        .notNull()
        .$onUpdate(() => new Date()),
});
//# sourceMappingURL=restaurants_schema.js.map