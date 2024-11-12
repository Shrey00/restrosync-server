import db from "../connection";
import { sql } from "drizzle-orm";
import { RestaurantRequestBody } from "../../types";
import { restaurants } from "../drizzle/schema/restaurants_schema";
import { address } from "../drizzle/schema/address_schema";
import { AddressType } from "../../types";
import { relationUsersRestaurants } from "../drizzle/schema/user_restaurant_relation_schema";
import { restaurantUpload } from "../../api/middlewares/storage";
import { AppError, handler } from "../../utils/ErrorHandler";
// function convertTo12Hour(time24 : string) {
//   // Split the input time into hours, minutes, and seconds
//   let [hours, minutes, seconds] = time24.split(':').map(Number);
//   const ampm = hours >= 12 ? 'PM' : 'AM';
//   hours = hours % 12 || 12;
//   return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${ampm}`;
// }

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
      logo,
      images,
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
            logo,
            images,
            cuisineType, //veg,non-veg or multi-cuisine
            opensAt,
            closesAt,
          } as any)
          .returning({
            id: restaurants.id,
          });
        //creates many-to-many relation between user(admin and other roles) and restaurant
        await txn.insert(relationUsersRestaurants).values({
          userId,
          restaurantId: insertedRestaurant[0].id,
        });
      });
    } catch (e) {
      if (e instanceof Error)
        throw new AppError(500, e?.message, "DB error", true);
    }
  }
  async findRestaurant(params: { id: string }) {
    const { id } = params;
    try {
      const response = await db
        .select({
          id: restaurants.id,
          name: restaurants.name,
          contact: restaurants.contact,
          rating: restaurants.rating,
          address: restaurants.address,
          opensAt: restaurants.opensAt,
          closesAt: restaurants.closesAt,
          logo: restaurants.logo,
          cuisineType: restaurants.cuisineType,
          acceptingOrders: restaurants.acceptingOrders,
        })
        .from(restaurants)
        .where(sql`${restaurants.id} = ${id}`);
      if (response.length > 0) return response[0];
      return { message: "DB Error", status: 500 };
    } catch (e) {
      if (e instanceof Error)
        throw new AppError(500, e?.message, "DB error", true);
    }
  }
  async findRestaurants(params: { softwareId: string }) {
    const { softwareId } = params;
    console.log("Whaaat")
    try {
      const response = await db
        .select({
          id: restaurants.id,
          name: restaurants.name,
          contact: restaurants.contact,
          rating: restaurants.rating,
          address: restaurants.address,
          opensAt: restaurants.opensAt,
          closesAt: restaurants.closesAt,
          logo: restaurants.logo,
          cuisineType: restaurants.cuisineType,
          acceptingOrders: restaurants.acceptingOrders,
        })
        .from(restaurants)
        .where(sql`${restaurants.softwareId}=${softwareId}`);
      return response;
    } catch (e) {
      if (e instanceof Error)
        throw new AppError(500, e?.message, "DB error", true);
    }
  }
  async findRestaurantsByUsers(params: { userId: string }) {
    const { userId } = params;
    try {
      const response = await db
        .select({
          id: restaurants.id,
          name: restaurants.name,
          rating: restaurants.rating,
          logo: restaurants.logo,
          opensAt: sql`to_char(${restaurants.opensAt}, 'HH12:MI AM')`,
          closesAt: sql`to_char(${restaurants.closesAt}, 'HH12:MI AM')`,
          cuisineType: restaurants.cuisineType,
          acceptingOrders: restaurants.acceptingOrders,
          nextOpeningTime: sql`to_char(${restaurants.nextOpeningTime}, 'HH12:MI AM')`, //only to be used for temporary opening and closing of restaurants
          nextClosingTime: sql`to_char(${restaurants.nextClosingTime}, 'HH12:MI AM')`,
        })
        .from(restaurants)
        .innerJoin(
          relationUsersRestaurants,
          sql`${relationUsersRestaurants.restaurantId}=${restaurants.id}`
        )
        .where(sql`${relationUsersRestaurants.userId}=${userId}`);
      if (response.length > 0) return response;
    } catch (e) {
      if (e instanceof Error)
        throw new AppError(500, e?.message, "DB error", false);
    }
  }
  async findAndUpdateRestaurant(params: Partial<RestaurantRequestBody>) {
    const { userId, ...restaurant } = params;
    try {
      const response = await db
        .update(restaurants)
        .set(restaurant)
        .where(sql`${restaurant.id}=${restaurant.id}`)
        .returning({
          updatedAt: restaurants.updatedAt,
        });
      if (response.length > 0)
        return { message: "successfully updated", status: 200 };
    } catch (e) {
      if (e instanceof Error)
        throw new AppError(500, e?.message, "DB error", true);
    }
  }
}
