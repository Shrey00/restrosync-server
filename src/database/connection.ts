import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./drizzle/schema/users_schema";
import "dotenv/config";

const queryClient = postgres(process.env.DB_URL as string);

const db = drizzle(queryClient, {
  schema,
});
export default db;
