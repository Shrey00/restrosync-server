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


import { menu } from "./menu_schema";
import { users } from "./users_schema";
export const cart = pgTable("cart", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  itemId: uuid("item_id")
    .notNull()
    .references(() => menu.id),
  quantity: smallint("quantity").notNull().default(1),
  finalPrice: real("final_price"),
});