import {
  pgTable,
  uuid,
  varchar,
  char,
  text,
  real,
  json,
  time,
  serial,
  boolean,
  integer,
  smallint,
  timestamp,
} from "drizzle-orm/pg-core";

import { restaurants } from "./restaurants_schema";
import { categories } from "./categories_schema";
import { types } from "./types_schema";
import { menuVariants } from "./menu_variants_schema";
export const menu = pgTable("menu", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  restaurantId: uuid("restaurant_id")
    .notNull()
    .references(() => restaurants.id),
  name: varchar("name", { length: 250 }).notNull(),
  category: integer("category").references(() => categories.id),
  type: integer("type").references(() => types.id),
  available: boolean("available"),
  cuisineType: varchar("cusine_type", { length: 15 }).notNull(),
  orders: integer("orders").notNull().default(0),
  description: text("description"),
  rating: real("rating"),
  reviewSummary: text("reviewSummary"),
  discount: smallint("discount"),
  markedPrice: real("marked_price"),
  sellingPrice: real("selling_price"),
  variant: varchar("variant", { length: 6 }).$type<
    "parent" | "child" | "none" | "add-ons"
  >(),
  calories: smallint("calories"),
  healthScore: smallint("healthScore"),
  showHealthInfo: boolean("show_healthinfo"),
  images: json("images").$type<string[]>().default([]),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    precision: 3,
  })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
    precision: 3,
  })
    .notNull()
    .$onUpdate(() => new Date()),
});
