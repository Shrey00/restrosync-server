import { User } from "../../types/users";
import { address } from "../drizzle/schema/address_schema";
import db from "../connection";
import { entityKind, sql } from "drizzle-orm";
import { AppError, handler } from "../../utils/ErrorHandler";
import { AddressType } from "../../types";
export class AddressRepository {
  async insertAddress(params: AddressType) {
    const {
      userId,
      address_line_1,
      address_line_2,
      city,
      state,
      country,
      postalCode,
      location,
      type,
    } = params;
    try {
      const response = await db
        .insert(address)
        .values({
          userId,
          address_line_1,
          address_line_2,
          city,
          state,
          country,
          postalCode,
          location,
          type,
        } as any)
        .returning({
          id: address.id,
          address_line_1: address.address_line_1,
          address_line_2: address.address_line_2,
          city: address.city,
          state: address.state,
          country: address.country,
          postalCode: address.postalCode,
          location: address.location,
          type: address.type,
        });
      return response;
    } catch (e) {
      if (e instanceof Error)
        throw new AppError(500, e?.message, "DB error", true);
    }
  }
  async updateAddress(params: Partial<AddressType>) {
    try {
      const response = await db
        .update(address)
        .set(params as any)
        .returning({
          id: address.id,
          userId: address.userId,
          address_line_1: address.address_line_1,
          address_line_2: address.address_line_2,
          city: address.city,
          state: address.state,
          country: address.country,
          postalCode: address.postalCode,
          location: address.location,
        });
      return response;
    } catch (e) {
      if (e instanceof Error)
        throw new AppError(500, e?.message, "DB error", true);
    }
  }
  async findAddressesByEntityId(params: { userId: string }) {
    try {
      const response = await db
        .select()
        .from(address)
        .where(sql`${address.userId}=${params.userId}`);
      return response;
    } catch (e) {
      if (e instanceof Error)
        throw new AppError(500, e?.message, "DB error", true);
    }
  }
}
