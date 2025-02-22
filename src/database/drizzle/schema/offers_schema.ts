import {
  pgTable,
  uuid,
  varchar,
  integer,
  text,
  smallint,
  timestamp,
} from "drizzle-orm/pg-core";

import { restaurants } from "./restaurants_schema";
import { users } from "./users_schema";
import { menu } from "./menu_schema";
import { categories } from "./categories_schema";

export const offers = pgTable("offers", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  image: text("image"),
  customerId: uuid("customer_id").references(() => users.id),
  offerName: varchar("offer_name", { length: 250 }).notNull(),
  discount: smallint("discount").notNull(),
  freeItem: uuid("free_item").references(() => menu.id),
  startTime: timestamp("start_time", {
    withTimezone: true,
    precision: 3,
  }).notNull(),
  endTime: timestamp("end_time", {
    withTimezone: true,
    precision: 3,
  }).notNull(),
  maxDiscountAmount: smallint("max_discount_amount").notNull(),
  minOrderValue: smallint("min_order_value").notNull(),
  maxUsage: smallint("max_usage").notNull(),
  usage: smallint("usage").default(0),
  couponCode: varchar("coupon_code", { length: 16 }),
  item: uuid("item").references(() => menu.id),
  category: integer("category").references(() => categories.id),
  restaurantId: uuid("restaurant_id").references(() => restaurants.id),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    precision: 3,
  })
    .defaultNow()
    .notNull(),
});
