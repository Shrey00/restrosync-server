import {
  pgTable,
  uuid,
  varchar,
  serial,
} from "drizzle-orm/pg-core";

import { menu } from "./menu_schema";

export const menuVariants = pgTable("menu_item_variants", {
  id: serial("id"),
  name: varchar("name",{length: 100}),
  mainItemId: uuid("main_item_id").references(() => menu.id, {onDelete: 'cascade'}),
  variantId: uuid("variant_id").references(() => menu.id, {onDelete: 'cascade'}),
});
