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
import { users } from "./users_schema";

export const discounts = pgTable("discounts", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  customerId: uuid("customer_id").references(() => users.id),
  restaurantId: uuid("restaurant_id").references(() => restaurants.id),
  validFrom: timestamp("valid_from", {
    withTimezone: true,
    precision: 3,
  }),
  validTill: timestamp("valid_till", {
    withTimezone: true,
    precision: 3,
  }),
  couponCode: text("coupon_code"),
  percentage: real("percentage"),
  maxDiscountAmount: real("max_discount_amount"),
  createdAt: timestamp("order_time", {
    withTimezone: true,
    precision: 3,
  }).defaultNow(),
});
