import { Address } from "cluster";
import { MenuRepository } from "../database/repository";
import {
  MenuItemRequestBody,
  MenuVariants,
  RestaurantRequestBody,
} from "../types";
export class Menu {
  private repository: any;
  constructor() {
    this.repository = new MenuRepository();
  }
  async postMenuItem(menuItem: Partial<MenuItemRequestBody>) {
    let {
      userId,
      restaurantId,
      category,
      name,
      type,
      cuisineType,
      orders,
      available,
      description,
      markedPrice,
      sellingPrice,
      discount,
      calories,
      healthScore,
      showHealthInfo,
      images,
    } = menuItem;
    const data: { id: string }[] = await this.repository.createMenuItem({
      userId,
      restaurantId,
      category,
      name,
      type,
      available,
      cuisineType,
      orders,
      description,
      markedPrice,
      sellingPrice,
      discount,
      calories,
      healthScore,
      showHealthInfo,
      images,
    });
    return data;
  }
  async getMenuItems(params: Partial<MenuItemRequestBody>, queryParams: any) {
    const restaurantId = params.restaurantId;
    const data = await this.repository.findMenuItems({
      restaurantId,
      queryParams,
    });
    console.log("RESPONSE", data[0].items);
    if (data) return data;
  }
  async getMenuItemsCategoryWise(
    params: Partial<MenuItemRequestBody>,
    queryParams: any
  ) {
    const restaurantId = params.restaurantId;
    const data = await this.repository.findMenuItemsCategoryWise({
      restaurantId,
      queryParams,
    });
    if (data) return data;
  }
  async getMenuVariants(params: { menuItemId: string }) {
    const data = await this.repository.findMenuItemVariants(params);
    if (data) return data;
  }
  async postMenuVariants(params: MenuItemRequestBody[]) {
    const data = await this.repository.createMenuItemVariants(params);
    if (data) return data;
  }
  async deleteMenuItem(param: any) {  
    const data = await this.repository.deleteMenuItem();
    if (data) return data;
  }
  async updateRestaurant(params: Partial<RestaurantRequestBody>) {
    const data = await this.repository.findAndUpdateMenu(params);
    if (data) return data;
  }
  async getMenuCategoriesAndType() {
    const data = await this.repository.findMenuItemCategoriesAndTypes();
    if (data) return data;
  }
  async postCategoryUnderAType(params: { category: string; type: string }) {
    const data = await this.repository.createCategory(params);
    if (data) return data;
  }

  async search(params: any) {
    const data = await this.repository.search(params);
    return data;
  }
}
