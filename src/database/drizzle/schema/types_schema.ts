import {
  pgTable,
  uuid,
  varchar,
  char,
  text,
  real,
  json,
  time,
  boolean,
  integer,
  serial,
  smallint,
  timestamp,
} from "drizzle-orm/pg-core";

//   import { type } from "./types_schema";

export const types = pgTable("types", {
  id: serial("id").primaryKey().notNull(),
  name: varchar("name", { length: 50 }),
});
