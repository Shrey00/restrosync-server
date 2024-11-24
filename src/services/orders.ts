import { Address } from "cluster";
import { MenuRepository } from "../database/repository";
import {
  MenuItemRequestBody,
  Restaurant,
  RestaurantRequestBody,
} from "../types";
import { OrdersRepository } from "../database/repository/orders";
export class Orders {
  private repository: any;
  constructor() {
    this.repository = new OrdersRepository();
  }
  async postOrder(params: any) {
    const response = await this.repository.createOrder(params);
    return response;
  }
}
