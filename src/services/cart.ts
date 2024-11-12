import { CartRepository } from "../database/repository";
import { CartItem } from "../types";

export class Cart {
  private repository: any;
  constructor() {
    this.repository = new CartRepository();
  }
  async postCartItem(params: CartItem) {
    const {itemId, userId, restaurantId}= params;
    const quantity = 1;
    const response = await this.repository.insertCartItem({itemId, userId, quantity, restaurantId});
    return response;
  }
  async getCartItems(params: { userId: string }) {
    const response = await this.repository.findCartItems(params);
    return response;
  }
}
