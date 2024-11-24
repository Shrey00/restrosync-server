import db from "../connection";
import { sql, eq, and, or } from "drizzle-orm";
import { QueryBuilder } from "drizzle-orm/pg-core";
import { MenuItem, MenuItemRequestBody } from "../../types";
import { menu } from "../drizzle/schema/menu_schema";
import { handler, AppError } from "../../utils/ErrorHandler";
import { categories } from "../drizzle/schema/categories_schema";
import { types } from "../drizzle/schema/types_schema";
import { menuVariants } from "../drizzle/schema/menu_variants_schema";
import { restaurantRoutes } from "../../api";
import { restaurants } from "../drizzle/schema/restaurants_schema";
import { query } from "express";
export class MenuRepository {
  async findMenuItems(params: { restaurantId: string; queryParams: any }) {
    try {
      // Object.keys(params.queryParams).forEach((key, index) => {
      //   if (
      //     Object.keys(params.queryParams).length > 0 &&
      //     index < 2 &&
      //     params.restaurantId
      //   ) {
      //     queryCondition += ` and `;
      //   }
      //   if (key === "searchQuery") {
      //     queryCondition += `${menu.name}=${params.queryParams[key]}`;
      //   }
      //   if (key === "cuisineType") {
      //     queryCondition += `${menu.cuisineType}=${params.queryParams[key]}`;
      //   }
      //   if (key === "ratingFrom") {
      //     queryCondition += `${menu.rating}>${params.queryParams[key]}`;
      //   }
      // });
      const conditions = [];
      conditions.push(
        or(sql`${menu.variant}=${"parent"}`, sql`${menu.variant}=${"none"}`)
      );
      if (params.restaurantId) {
        conditions.push(sql`${menu.restaurantId}=${params.restaurantId}`);
      }
      if (params?.queryParams?.searchQuery) {
        conditions.push(
          sql`${menu.name}=${params.queryParams.searchQuery}  or ${categories.name}=${params.queryParams.searchQuery}`
        );
      }
      if (params?.queryParams?.cuisineType === "veg") {
        conditions.push(sql`${menu.cuisineType}='veg'`);
      } else if (params?.queryParams?.cuisineType === "non-veg") {
        conditions.push(sql`${menu.cuisineType}='non-veg'`);
      }
      if (params?.queryParams.ratingFrom === "rating_2") {
        conditions.push(sql`${menu.rating}>2`);
      } else if (params?.queryParams.ratingFrom === "rating_3") {
        conditions.push(sql`${menu.rating}>3`);
      } else if (params?.queryParams.ratingFrom === "rating_4") {
        conditions.push(sql`${menu.rating}>4`);
      }
      let query = db
        .select({
          id: menu.id,
          name: menu.name,
          // category: categories.name,
          available: menu.available,
          type: types.name,
          cuisineType: menu.cuisineType,
          orders: menu.orders,
          description: menu.description,
          rating: menu.rating,
          reviewSummary: menu.reviewSummary,
          discount: menu.discount,
          markedPrice: menu.markedPrice,
          sellingPrice: menu.sellingPrice,
          calories: menu.calories,
          healthScore: menu.healthScore,
          showHealthInfo: menu.showHealthInfo,
          images: menu.images,
          variant: menu.variant,
        })
        .from(menu)
        .where(and(...conditions))
        .innerJoin(categories, sql`${menu.category}=${categories.id}`)
        .innerJoin(types, sql`${menu.type}=${types.id}`)
        .$dynamic();
      if (params?.queryParams?.sortBy === "ascendingPrice") {
        query = query.orderBy(sql`${menu.sellingPrice} asc`);
      } else if (params?.queryParams?.sortBy === "descendingPrice") {
        query = query.orderBy(sql`${menu.sellingPrice} desc`);
      }
      const response = await query;
      return response;
    } catch (e) {
      if (e instanceof Error)
        throw new AppError(500, e?.message, "DB error", false);
    }
  }
  async findMenuItemsCategoryWise(params: {
    restaurantId: string;
    queryParams: any;
  }) {
    console.log("HERE", params.queryParams);
    try {
      const conditions = [];
      conditions.push(
        or(sql`${menu.variant}=${"parent"}`, sql`${menu.variant}=${"none"}`)
      );
      if (params.restaurantId) {
        conditions.push(sql`${menu.restaurantId}=${params.restaurantId}`);
      }
      if (params?.queryParams?.searchQuery) {
        conditions.push(
          and(
            sql`(${categories.name} ILIKE ${
              "%" + params.queryParams.searchQuery + "%"
            } or ${menu.name} ILIKE ${
              "%" + params.queryParams.searchQuery + "%"
            })`
          )
        );
      }
      if (params?.queryParams?.cuisineType === "veg") {
        conditions.push(sql`${menu.cuisineType}='veg'`);
      } else if (params?.queryParams?.cuisineType === "non-veg") {
        conditions.push(sql`${menu.cuisineType}='non-veg'`);
      }
      if (params?.queryParams.ratingFrom === "rating_2") {
        conditions.push(sql`${menu.rating}>2`);
      } else if (params?.queryParams.ratingFrom === "rating_3") {
        conditions.push(sql`${menu.rating}>3`);
      } else if (params?.queryParams.ratingFrom === "rating_4") {
        conditions.push(sql`${menu.rating}>4`);
      }
      let query = db
        .select({
          categoryId: categories.id,
          category: categories.name,
          items: sql`json_agg(json_build_object(
            'id', ${menu.id},
            'name', ${menu.name},
            'available', ${menu.available},
            'cuisineType', ${menu.cuisineType},
            'orders', ${menu.orders},
            'description', ${menu.description},
            'rating', ${menu.rating},
            'reviewSummary', ${menu.reviewSummary},
            'discount', ${menu.discount},
            'markedPrice', ${menu.markedPrice},
            'sellingPrice', ${menu.sellingPrice},
            'calories', ${menu.calories},
            'healthScore', ${menu.healthScore},
            'healthInfo', ${menu.showHealthInfo},
            'images', ${menu.images},
            'variant', ${menu.variant}
          ))`,
        })
        .from(menu)
        .where(and(...conditions))
        .innerJoin(categories, sql`${menu.category}=${categories.id}`)
        .innerJoin(types, sql`${menu.type}=${types.id}`)
        .groupBy(categories.name, categories.id)
        .$dynamic();
      if (params?.queryParams?.sortBy === "ascendingPrice") {
        query = query.orderBy(sql`${menu.sellingPrice} asc`);
      } else if (params?.queryParams?.sortBy === "descendingPrice") {
        query = query.orderBy(sql`${menu.sellingPrice} desc`);
      }
      // console.log("-------------------------------------------------------------------------")
      const response = await query;
      // console.log(response);
      return response;
    } catch (e) {
      if (e instanceof Error)
        throw new AppError(500, e?.message, "DB error", false);
    }
  }
  async findMenuItemVariants(params: { menuItemId: string }) {
    try {
      const response = await db
        .select({
          id: menu.id,
          name: menu.name,
          markedPrice: menu.markedPrice,
          sellingPrice: menu.sellingPrice,
          variant: menu.variant,
          variantName: menuVariants.name,
          discount: menu.discount,
        })
        .from(menuVariants)
        .innerJoin(menu, sql`${menuVariants.variantId}=${menu.id}`)
        .where(sql`${menuVariants.mainItemId}=${params.menuItemId}`)
        .orderBy(sql`${menu.name}`);
      return response;
    } catch (e) {
      if (e instanceof Error)
        throw new AppError(500, e?.message, "DB error", true);
    }
  }

  async createMenuItem(params: MenuItem) {
    let {
      restaurantId,
      name,
      category,
      type,
      cuisineType,
      description,
      available,
      markedPrice,
      sellingPrice,
      discount,
      calories,
      healthScore,
      showHealthInfo,
      images,
      variant,
    } = params;
    try {
      const response = await db
        .insert(menu)
        .values({
          restaurantId,
          name,
          category,
          type,
          available,
          cuisineType,
          description,
          markedPrice,
          sellingPrice,
          discount,
          calories,
          healthScore,
          showHealthInfo,
          images,
          variant,
        } as any)
        .returning({
          id: menu.id,
          name: menu.name,
          category: menu.category,
          type: menu.type,
          available: menu.available,
          cuisineType: menu.cuisineType,
          description: menu.description,
          markedPrice: menu.markedPrice,
          sellingPrice: menu.sellingPrice,
          discount: menu.discount,
          calories: menu.calories,
          healthScore: menu.healthScore,
          rating: menu.rating,
          variant: menu.variant,
          showHealthInfo: menu.showHealthInfo,
          images: menu.images,
        });
      if (response.length) return response;
    } catch (e) {
      if (e instanceof Error)
        throw new AppError(500, e?.message, "DB error", false);
    }
  }
  async createMenuItemVariants(params: MenuItemRequestBody[]) {
    try {
      for (const item of params) {
        (async () => {
          const { mainItemId, variantName } = item;
          const response = await this.createMenuItem(item);
          await db.insert(menuVariants).values({
            mainItemId: mainItemId,
            variantId: response && response[0].id,
            name: variantName,
          });
        })();
      }
    } catch (e) {
      if (e instanceof Error)
        throw new AppError(500, e?.message, "DB error", false);
    }
  }
  async findAndUpdateMenu(params: Partial<MenuItemRequestBody>) {
    try {
      const response = await db
        .update(menu)
        .set(params as any)
        .where(sql`${menu.id}=${params.id}`)
        .returning({
          updatedAt: menu.updatedAt,
        });
      if (response.length > 0)
        return { message: "successfully updated", status: 200 };
    } catch (e) {
      if (e instanceof Error)
        throw new AppError(500, e?.message, "DB error", true);
    }
  }
  async findMenuItemCategoriesAndTypes() {
    try {
      const response = await db
        .select({
          id: types.id,
          type: types.name,
          categories: sql`json_agg(json_build_object(
              'id', ${categories.id},
              'name', ${categories.name}
            ))`,
        })
        .from(categories)
        .innerJoin(types, sql`${categories.type}=${types.id}`)
        .groupBy(types.name, types.id);
      if (response.length > 0) return response;
    } catch (e) {
      if (e instanceof Error)
        throw new AppError(500, e?.message, "DB error", true);
    }
  }
  async createCategory(params: { category: string; type: string }) {
    try {
      const response = await db
        .insert(categories)
        .values({ category: params.category, type: params.type } as any)
        .returning({ id: categories.id });

      if (response.length > 0) return response;
    } catch (e) {
      if (e instanceof Error)
        throw new AppError(500, e?.message, "DB error", true);
    }
  }
  async deleteMenuItem(params: any) {
    try {
      const response = await db
        .delete(menu)
        .where(sql`${menu.id}=${params.menuItemId}`);

      if (response.length > 0) return response;
    } catch (e) {
      if (e instanceof Error)
        throw new AppError(500, e?.message, "DB error", true);
    }
  }
  async search(params: any) {
    try {
      const response = await db
        .select({
          itemName: menu.name,
          restaurantName: restaurants.name,
          restaurantId: restaurants.id,
          cuisineType: menu.cuisineType,
          categoryName: categories.name,
        })
        .from(menu)
        .innerJoin(categories, sql`${menu.category}=${categories.id}`)
        .innerJoin(restaurants, sql`${menu.restaurantId}=${restaurants.id}`)
        .where(
          sql`(${menu.name} ILIKE ${"%" + params.searchQuery + "%"} or ${
            categories.name
          } ILIKE ${"%" + params.searchQuery + "%"}) and (${
            menu.variant
          }=${"parent"} or ${menu.variant}=${"none"})`
        );
      return response;
    } catch (e) {
      if (e instanceof Error)
        throw new AppError(500, e?.message, "DB error", true);
    }
  }
}
