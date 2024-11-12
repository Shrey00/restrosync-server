import {
  pgTable,
  uuid,
  varchar,
  char,
  text,
  real,
  serial,
  json,
  smallint,
  timestamp,
} from "drizzle-orm/pg-core";

import { restaurants } from "./restaurants_schema";
import { users } from "./users_schema";
import { menu } from "./menu_schema";
export const reviews = pgTable("reviews", {
  id: uuid("id").primaryKey().notNull(),
  userId: uuid("user_id").references(() => users.id),
  menuItemId: uuid("menu_item_id").references(() => menu.id, {
    onDelete: "no action",
  }),
  restaurantId: uuid("restaurant_id").references(() => restaurants.id, {
    onDelete: "no action",
  }),
  rating: smallint("rating").notNull(),
  comment: text("comment").notNull(),
  parentCommentId: uuid("parent_comment_id"),
  createdAt: timestamp("created_at", { withTimezone: true, precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, precision: 3 })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});
