import { User } from "../../types/users";
import { users } from "../drizzle/schema/users_schema";
import db from "../connection";
import { sql, eq } from "drizzle-orm";
import { AppError, handler } from "../../utils/ErrorHandler";

export class UserRepository {
  async createUser(params: User) {
    const { firstName, lastName, contact, countryCode, email, password, role } =
      params;
    try {
      const response = await db
        .insert(users)
        .values({
          firstName,
          lastName,
          contact,
          countryCode,
          email,
          password,
          role,
        } as any)
        .returning({
          id: users.id,
          firstName: users.firstName,
          lastName: users.lastName,
          email: users.email,
          role: users.role,
          contact: users.contact,
          countryCode: users.countryCode,
        });
      return response[0];
    } catch (e) {
      if (e instanceof Error)
        throw new AppError(500, e?.message, "DB error", true);
    }
  }
  async findUserByEmail(params: { email: string }) {
    const { email } = params;
    try {
      const data = await db
        .select()
        .from(users)
        .where(sql`${users.email}=${email} AND ${users.accountActive}=${true}`);
      if (data.length) return data[0];
      return null;
    } catch (e) {
      if (e instanceof Error)
        throw new AppError(500, e?.message, "DB error", false);
    }
  }
  async findUserById(params: { id: string }) {
    const { id } = params;
    try {
      const data = await db
        .select({
          firstName: users.firstName,
          lastName: users.lastName,
          email: users.email,
          role: users.role,
          contact: users.contact,
          countryCode: users.countryCode,
        })
        .from(users)
        .where(sql`${users.id}=${id} AND ${users.accountActive}=${true}`);
      return data[0];
    } catch (e) {
      if (e instanceof Error)
        throw new AppError(500, e?.message, "DB error", false);
    }
  }
  async findUserByContact(params: { contact: string }) {
    const { contact } = params;
    try {
      const data = await db
        .select({
          id: users.id,
          firstName: users.firstName,
          lastName: users.lastName,
          contact: users.contact,
          countryCode: users.countryCode,
          email: users.email,
          role: users.role,
          loyaltyPoints: users.loyaltyPoints,
        })
        .from(users)
        .where(sql`${users.contact} = ${contact}`);
      if (data.length) return data[0];
      return null;
    } catch (e) {
      if (e instanceof Error)
        throw new AppError(500, e?.message, "DB error", false);
    }
  }
  async patchAccountActiveStatus(params: { userId: string }) {
    const { userId } = params;
    try {
      const data = await db
        .update(users)
        .set({ accountActive: false })
        .where(sql`${users.id}=${userId}`);
    } catch (e) {
      if (e instanceof Error)
        throw new AppError(500, e?.message, "DB error", false);
    }
  }
}
