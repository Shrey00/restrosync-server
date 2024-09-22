import { User } from "../../types/users";
import { users } from "../drizzle/schema/users_schema";
import db from "../connection";
import { sql } from "drizzle-orm";
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
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        role: users.role,
        contact: users.contact,
        countryCode: users.countryCode,
      });
      return response[0];
    }catch(e) {
      console.log(e);
    }
  }
  async findUser(params: { email: string }) {
    const { email } = params;
    try {
      const data = await db
      .select()
      .from(users)
      .where(sql`${users.email} = ${email}`);
      return data[0];
    }catch(e) {
      console.log(e);
    }
    
  }
}
