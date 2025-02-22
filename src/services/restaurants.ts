import { Address } from "cluster";
import { RestaurantRepository } from "../database/repository";
import { Restaurant, RestaurantRequestBody } from "../types";
import { Offer } from "../types";
export class Restaurants {
  private repository: any;
  constructor() {
    this.repository = new RestaurantRepository();
  }
  async postRestaurant(restaurant: Partial<RestaurantRequestBody>) {
    let {
      userId,
      name,
      email,
      contact,
      countryCode,
      description,
      logo,
      images,
      cuisineType,
      opensAt,
      closesAt,
      acceptingOrders,
    } = restaurant;
    const data: Restaurants = this.repository.createRestaurant({
      userId,
      name,
      email,
      contact,
      countryCode,
      description,
      logo,
      images,
      cuisineType,
      opensAt,
      closesAt,
      acceptingOrders,
    });
    return data;
  }
  async postAddress(address: Address) {
    const data = this.repository(address);
    if (data) return data;
  }
  async getRestaurant(restaurant: Partial<Restaurant>) {
    const { id } = restaurant;
    const data = this.repository.findRestaurant({ id });
    if (data) return data;
  }
  async getRestaurantsByUsers(params: Partial<RestaurantRequestBody>) {
    const { userId } = params;
    const data = this.repository.findRestaurantsByUsers({ userId });
    if (data) return data;
  }
  async getRestaurants(params: { softwareId: string }) {
    const data = this.repository.findRestaurants(params);
    return data;
  }
  async updateRestaurant(params: Partial<RestaurantRequestBody>) {
    const data = this.repository.findAndUpdateRestaurant(params);
    if (data) return data;
  }
  async getOffers(restaurant: Partial<Restaurant>) {
    const { id } = restaurant;
    const data = this.repository.findRestaurantOffers({ restaurantId: id });
    if (data) return data;
  }
  async createOffers(params: Offer) {
    const data = this.repository.createOffers(params);
    if (data) return data;
  }
}
