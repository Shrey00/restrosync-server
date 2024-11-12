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

import { types } from "./types_schema";

export const categories = pgTable("categories", {
  id: serial("id").primaryKey().notNull(),
  name: varchar("name", { length: 50 }),
  image: text("image"),
  type: serial("type").references(() => types.id),
});
