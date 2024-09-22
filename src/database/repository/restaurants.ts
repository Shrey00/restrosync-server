import db from "../connection";
import { sql } from "drizzle-orm";
import { RestaurantRequestBody } from "../../types";
import { restaurants } from "../drizzle/schema/restaurants_schema";
import { relationUsersRestaurants } from "../drizzle/schema/user_restaurant_relation_schema";
export class RestaurantRepository {
  async createRestaurant(params: RestaurantRequestBody) {
    let {
      userId,
      name,
      email,
      contact,
      countryCode,
      description,
      rating,
      address,
      logo,
      imgList,
      cuisineType, //veg,non-veg or multi-cuisine
      opensAt,
      closesAt,
      acceptingOrders,
    } = params;
    try {
      const response = await db.transaction(async (txn) => {
        const insertedRestaurant = await txn
          .insert(restaurants)
          .values({
            name,
            email,
            contact,
            countryCode,
            description,
            rating,
            address,
            logo,
            imgList,
            cuisineType, //veg,non-veg or multi-cuisine
            opensAt,
            closesAt,
            acceptingOrders,
          } as any)
          .returning({
            id: restaurants.id,
          });
        //creates many-to-many relation between user(admin and other roles) and restaurant
          await txn.insert(relationUsersRestaurants).values({
          userId,
          restaurantId: insertedRestaurant[0].id  
        });
      });
    } catch (e) {
      console.log(e);
    }
  }
}
