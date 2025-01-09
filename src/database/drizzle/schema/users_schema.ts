import {
  pgTable,
  uuid,
  varchar,
  char,
  text,
  real,
  boolean,
  json,
  smallint,
  timestamp,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  firstName: varchar("first_name", { length: 50 }).notNull(),
  lastName: varchar("last_name", { length: 50 }).notNull(),
  role: varchar("role", { length: 50 }).notNull().default("customer"),
  contact: char("contact", { length: 10 }).notNull().unique(),
  countryCode: char("country_code", { length: 3 }).default("+91"),
  email: varchar("email", { length: 100 }).notNull().unique(),
  password: text("password").notNull(),
  emailVerified: boolean("email_verified").default(false),
  contactVerified: boolean("contact_verified").default(false),
  loyaltyPoints: smallint("loyalty_points").default(10).notNull(),
  accountActive: boolean("account_active").default(true).notNull(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    precision: 3,
  })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
    precision: 3,
  })
    .notNull()
    .$onUpdate(() => new Date()),
});

