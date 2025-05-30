import {
  pgTable,
  uuid,
  varchar,
  char,
  text,
  real,
  json,
  time,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { address } from "./address_schema";

export const restaurants = pgTable("restaurants", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  softwareId: uuid("software_id").defaultRandom().notNull(),
  name: varchar("name", { length: 200 }).notNull(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  contact: varchar("contact", { length: 20 }).notNull().unique(),
  countryCode: char("country_code", { length: 3 }).default("+91"),
  description: text("description"),
  rating: real("rating"),
  address: uuid("address").references(() => address.id, {
    onDelete: "cascade",
  }),
  logo: text("logo"),
  images: json("images").$type<string[]>().default([]),
  cuisineType: varchar("cusine_type", { length: 15 }).notNull(), //veg,non-veg or multi-cuisine
  opensAt: time("opens_at"),
  closesAt: time("closes_at"),
  acceptingOrders: boolean("accepting_orders").default(false).notNull(),
  // location: boolean("accepting_orders").default(false).notNull(),
  nextOpeningTime: time("next_opening_time"), //only to be used for temporary opening and closing of restaurants
  nextClosingTime: time("next_closing_time"), //only to be used for temporary opening and closing of restaurants
  type: varchar("type", { length: 30 }).$type<"parent" | "child">(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    precision: 3,
  })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
    precision: 3,
  })
    .notNull()
    .$onUpdate(() => new Date()),
});
