import { pgTable, uuid } from "drizzle-orm/pg-core";
import { restaurants } from "./restaurants_schema";
import { users } from "./users_schema";
import { offers } from "./offers_schema";
export const relationRestaurantsUsers = pgTable("relation_restaurants_offers", {
  id: uuid("id").primaryKey().defaultRandom(),
  offerId: uuid("offer_id").references(() => offers.id, {
    onDelete: "cascade",
  }),
  restaurantId: uuid("restaurant_id").references(() => restaurants.id),
});
