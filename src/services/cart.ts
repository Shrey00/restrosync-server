import { CartRepository } from "../database/repository";
import { CartItem } from "../types";

export class Cart {
  private repository: any;
  constructor() {
    this.repository = new CartRepository();
  }
  async postCartItem(params: CartItem) {
    const { userId, menuItemId, restaurantId } = params;
    const quantity = 1;
    const response = await this.repository.insertCartItem({
      menuItemId,
      userId,
      quantity,
      restaurantId,
    });
    return response;
  }
  async getCartItems(params: { userId: string }) {
    const response = await this.repository.findCartItems(params);
    return response;
  }
  async patchQuantity(params: { itemId: string; quantity: number }) {
    const response = await this.repository.updateQuantity(params);
    return response;
  }
  async deleteCartItem(params: { itemId: string }) {
    const response = await this.repository.deleteCartItem(params);
    return response;
  }
}
