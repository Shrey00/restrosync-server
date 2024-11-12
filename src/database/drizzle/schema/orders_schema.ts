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
import { address } from "./address_schema";

export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  orderId: varchar("order_id", { length: 300 }),
  customerId: uuid("customer_id").references(() => users.id, {
    onDelete: "no action",
  }),
  restaurantId: uuid("restaurant_id").references(() => restaurants.id, {
    onDelete: "no action",
  }),
  taxes: real("taxes"),
  deliveryCharges: real("delivery_charges"),
  deleted: boolean("deleted").default(false),
  totalAmount: real("total_amount"),
  paymentMethod: varchar("payment_method", { length: 50 })
    .$type<"COD" | "UPI" | "Debit Card" | "Credit Card" | "Net Banking">()
    .notNull(),
  paymentStatus: varchar("payment_status", { length: 50 }).$type<
    "Created" | "Authorised" | "Captured" | "Refunded" | "Failed"
  >(),
  scheduledOrder: boolean("scheduled_order").default(false), // use expected delivery time for schedule
  scheduledAt: timestamp("scheduled_at", {
    withTimezone: true,
    precision: 3,
  }).notNull(),
  address: uuid("address").references(() => address.id),
  createdAt: timestamp("order_time", {
    withTimezone: true,
    precision: 3,
  })
    .defaultNow()
    .notNull(),
});
