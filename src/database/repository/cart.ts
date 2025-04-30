import db from "../connection";
import { sql } from "drizzle-orm";
import { menu } from "../drizzle/schema/menu_schema";
import { AppError } from "../../utils/ErrorHandler";
import { cart } from "../drizzle/schema/cart_schema";
import { CartItem } from "../../types";
export class CartRepository {
  async findCartItems(params: { userId: string; itemId: any }) {
    try {
      const response = await db
        .select({
          id: cart.id,
          menuItemId: menu.id,
          restaurantId: menu.restaurantId,
          name: menu.name,
          quantity: cart.quantity,
          sellingPrice: cart.finalPrice,
          cuisineType: menu.cuisineType,
          markedPrice: menu.markedPrice,
          discount: menu.discount,
          category: menu.category,
          addOns: cart.addOns,
        })
        .from(cart)
        .innerJoin(menu, sql`${cart.menuItemId}=${menu.id}`)
        .where(sql`${cart.userId}=${params.userId}`);
      console.log(JSON.stringify(response, null, 2));

      return response;
    } catch (e) {
      if (e instanceof Error)
        throw new AppError(500, e?.message, "DB error", false);
    }
  }
  async insertCartItem(params: CartItem) {
    try {
      const response = await db.transaction(async (txn) => {
        const itemPrice = await txn
          .select({ sellingPrice: menu.sellingPrice })
          .from(menu)
          .where(sql`${menu.id}=${params.menuItemId}`);
        const insertCartItem = await txn
          .insert(cart)
          .values({
            userId: params.userId!,
            menuItemId: params.menuItemId!,
            quantity: params.quantity!,
            finalPrice: itemPrice[0].sellingPrice
              ? itemPrice[0].sellingPrice * params.quantity!
              : itemPrice[0].sellingPrice,
            addOns: params.addOns,
          })
          .returning({
            id: cart.id,
            userId: cart.userId,
            menuItemId: cart.menuItemId,
            quantity: cart.quantity,
            finalPrice: cart.finalPrice,
            addOns: cart.addOns,
          });
        return insertCartItem;
      });
      return response;
    } catch (e) {
      if (e instanceof Error)
        throw new AppError(500, e?.message, "DB error", false);
    }
  }
  async updateQuantity(params: { itemId: string; quantity: number }) {
    try {
      const response = await db
        .update(cart)
        .set({ quantity: params.quantity })
        .where(sql`${cart.id}=${params.itemId}`);
      return response;
    } catch (e) {
      if (e instanceof Error)
        throw new AppError(500, e?.message, "DB error", false);
    }
  }
  async deleteCartItem(params: { itemId: string }) {
    try {
      const response = await db
        .delete(cart)
        .where(sql`${cart.id}=${params.itemId}`);
      return response;
    } catch (e) {
      if (e instanceof Error)
        throw new AppError(
          500,
          e?.message,
          "Error Occured while deleting the cart item.",
          false
        );
    }
  }
  async deleteAllCartItems(params: { userId: string }) {
    try {
      const response = await db
        .delete(cart)
        .where(sql`${cart.userId}=${params.userId}`);
      return response;
    } catch (e) {
      if (e instanceof Error)
        throw new AppError(
          500,
          e?.message,
          "Error Occured while deleting the cart item.",
          false
        );
    }
  }
}
