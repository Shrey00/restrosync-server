import {
  pgTable,
  uuid,
  varchar,
  text,
  point,
  boolean,
} from "drizzle-orm/pg-core";

import { users } from "./users_schema";

export const address = pgTable("address", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  userId: uuid("user_id").references(() => users.id, {
    onDelete: "no action",
  }),
  address_line_1: text("address_line_1"),
  address_line_2: text("address_line_2"),
  city: text("city").notNull(),
  state: text("state").notNull(),
  country: text("country").notNull(),
  postalCode: text("postal_code").notNull(),
  location: point("point", { mode: "xy" }),
  type: varchar("type", { length: 40 }).$type<"Home" | "Office" | "Hotel">(),
  selected: boolean("selected").default(false),
});
