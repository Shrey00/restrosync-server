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
import { restaurants } from './restaurants_schema';
import { users } from './users_schema';
export const relationUsersRestaurants = pgTable("relation_users_restaurants", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  restaurantId: uuid("restaurant_id").references(() => restaurants.id),
});