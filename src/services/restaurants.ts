import { RestaurantRepository } from "../database/repository";
import { RestaurantRequestBody } from '../types';
export class Restaurants {
  private repository: any;
  constructor() {
    this.repository = new RestaurantRepository();
  }
  async postRestaurant(restaurant : RestaurantRequestBody) {
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
        cuisineType,//veg,non-veg or multi-cuisine
        opensAt,
        closesAt,
        acceptingOrders,
    } = restaurant;
    this.repository.createRestaurant({
        userId,
        name,
        email,
        contact,
        countryCode,
        description,
        rating,
        address ,
        logo,
        imgList,
        cuisineType,//veg,non-veg or multi-cuisine
        opensAt,
        closesAt,
        acceptingOrders,
    });
  }
}
