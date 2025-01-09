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
  async getOrdersByUser(params: any) {
    const response = await this.repository.getOrdersByUser(params);
    return response;
  }
  async updateOrderStatus(params: { orderStatus: string; orderId: string }) {
    const response = await this.repository.updateOrderStatus(params);
    return response;
  }
  async getPendingOrderDetails(params: { userId: string }) {
    const response = await this.repository.getPendingOrderDetails(params);
    return response;
  }
  async getOrderStatus(params: { orderId: string }) {
    const response = await this.repository.getOrderStatus(params);
    return response;
  }
}
