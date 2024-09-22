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
  integer,
  smallint,
  timestamp,
} from "drizzle-orm/pg-core";

import { restaurants } from "./restaurants_schema";

export const menu = pgTable("menu", {
  id: uuid("id").primaryKey().defaultRandom(),
  restaurantId: uuid("restaurant_id")
    .notNull()
    .references(() => restaurants.id),
  primaryCategory: varchar("primary_category", { length: 50 }),
  secondaryCategory: varchar("secondary_category", { length: 50 }),
  cuisineType: varchar("cusine_type", { length: 15 }).notNull(),
  orders: integer("integer").notNull().default(0),
  description: text("description"),
  rating: real("rating"),
  reviewSummary: text("text"),
  price: real("price"),
  discount: smallint("discount"),
  calories: smallint("calories"),
  healthScore: smallint("healthScore"),
  showHealthscore: boolean("show_healthscore"),
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