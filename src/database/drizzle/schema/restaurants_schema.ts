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
  timestamp,
} from "drizzle-orm/pg-core";

export const restaurants = pgTable("restaurants", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 200 }).notNull(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  contact: varchar("contact", { length: 20 }).notNull().unique(),
  countryCode: char("country_code", { length: 3 }).default("+91"),
  description: text("description"),
  rating: real("rating"),
  address: json("address").notNull().$type<{ address: string, landmark: string, city:string, district: string, latitude: number, longitude: number }>().default({
    address: "",
    landmark: "",
    city: "",
    district: "",
    latitude: 0,
    longitude: 0
  }),
  logo: text("logo"),
  imgList: json("img_list").$type<string[]>().default([]),
  cuisineType: varchar("cusine_type",{ length: 15 }).notNull(), //veg,non-veg or multi-cuisine
  opensAt: time("opens_at"),
  closesAt: time("closes_at"),
  acceptingOrders: boolean("accepting_orders").notNull(),
  nextOpeningTime: time("next_opening_time"), //only to be used for temporary opening and closing of restaurants
  nextClosingTime: time("next_closing_time"), //only to be used for temporary opening and closing of restaurants
  createdAt: timestamp("created_at", {
    withTimezone: true,
    precision: 3,
  }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
    precision: 3,
  }).notNull().$onUpdate(() => new Date()),
});