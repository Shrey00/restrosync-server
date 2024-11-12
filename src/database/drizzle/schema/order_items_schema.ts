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
import { menu } from "./menu_schema";
import { orders } from "./orders_schema";

export const orderItems = pgTable("order_items", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  orderId: uuid("order_id").references(() => orders.id),
  status: varchar("status", { length: 50 }).$type<
    "Pending" | "Ready" | "Cancelled"
  >(),
  orderItem: uuid("order_item").references(() => menu.id),
  quantity: smallint("quantity").default(1),
  amount: real("amount").notNull(),
  addNote: text("add_note"),
});
