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
  smallint,
  timestamp,
} from "drizzle-orm/pg-core";

import { restaurants } from "./restaurants_schema";
import { users } from "./users_schema";
import { orders } from "./orders_schema";
import { address } from "./address_schema";

export const deliveries = pgTable("deliveries", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  orderId: uuid("order_id").references(() => orders.id),
  deliveryPartnerId: uuid("delivery_partner_id").references(() => users.id),
  status: varchar("status", { length: 50 }).$type<
    "Pending" | "Ready" | "Dispatched" | "Delivered" | "Cancelled"
  >(),
  address: uuid("address").references(() => address.id),
  assignedAt: timestamp("assigned_at", { withTimezone: true, precision: 3 }),
  pickedUpAt: timestamp("pickedup_at", { withTimezone: true, precision: 3 }),
  estimatedDeliveryTime: timestamp("estimated_delivery_time", {
    withTimezone: true,
    precision: 3,
  }).notNull(),
  deliveredAt: timestamp("delivered_at", { withTimezone: true, precision: 3 }),
  deliveryNotes: text("delivery_notes"),
  location_coordinates: json("location_coordinates")
    .$type<{ latitude: string; longitude: string }>()
    .default({
      latitude: "",
      longitude: "",
    }),
});
