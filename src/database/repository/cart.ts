import db from "../connection";
import { sql } from "drizzle-orm";
import { MenuItemRequestBody } from "../../types";
import { menu } from "../drizzle/schema/menu_schema";
import { handler, AppError } from "../../utils/ErrorHandler";
import { categories } from "../drizzle/schema/categories_schema";
import { cart } from "../drizzle/schema/cart_schema";
export class CartRepository {
  async findCartItems(params: { userId: string; itemId: any }) {
    try {
      const response = await db
        .select({
          id: cart.id,
          name: menu.name,
          quantity: cart.quantity,
          sellingPrice: cart.finalPrice,
          cuisineType: menu.cuisineType,
          markedPrice: menu.markedPrice,
          discount: menu.discount,
        })
        .from(cart)
        .innerJoin(menu, sql`${cart.itemId}=${menu.id}`)
        .where(sql`${cart.userId}=${params.userId}`);
      return response;
    } catch (e) {
      if (e instanceof Error)
        throw new AppError(500, e?.message, "DB error", false);
    }
  }
  async insertCartItem(params: {
    userId: string;
    itemId: string;
    quantity: number;
  }) {
    try {
      const response = await db.transaction(async (txn) => {
        const itemPrice = await txn
          .select({ sellingPrice: menu.sellingPrice })
          .from(menu)
          .where(sql`${menu.id}=${params.itemId}`);
        const insertCartItem = await txn
          .insert(cart)
          .values({
            userId: params.userId,
            itemId: params.itemId,
            quantity: params.quantity,
            finalPrice: itemPrice[0].sellingPrice
              ? itemPrice[0].sellingPrice * params.quantity
              : itemPrice[0].sellingPrice,
          })
          .returning({
            id: cart.id,
            userId: cart.userId,
            itemId: cart.itemId,
            quantity: cart.quantity,
            finalPrice: cart.finalPrice,
          });
        return insertCartItem;
      });
      return response;
    } catch (e) {
      if (e instanceof Error)
        throw new AppError(500, e?.message, "DB error", false);
    }
  }
}
