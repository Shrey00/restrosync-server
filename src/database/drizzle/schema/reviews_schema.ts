import {
  pgTable,
  uuid,
  varchar,
  char,
  text,
  real,
  json,
  smallint,
  timestamp,
} from "drizzle-orm/pg-core";

import { restaurants } from "./restaurants_schema";
import { users } from "./users_schema";
import { menu } from './menu_schema';
export const reviews = pgTable("reviews", {
  id: uuid("id").primaryKey().defaultRandom(),
  menuItemId: uuid("menu_item_id").references(()=> menu.id),
  userId: uuid("user_id").references(() => users.id),
  restaurant_id: uuid("restaurant_id").references(() => restaurants.id),
  rating: smallint("rating").notNull(),
  review: text("review").notNull(),
});
