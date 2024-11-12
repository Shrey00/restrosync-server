"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.users = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.users = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom().notNull(),
    firstName: (0, pg_core_1.varchar)("first_name", { length: 50 }).notNull(),
    lastName: (0, pg_core_1.varchar)("last_name", { length: 50 }).notNull(),
    role: (0, pg_core_1.varchar)("role", { length: 50 }).notNull().default("customer"),
    contact: (0, pg_core_1.char)("contact", { length: 10 }).notNull().unique(),
    countryCode: (0, pg_core_1.char)("country_code", { length: 3 }).default("+91"),
    email: (0, pg_core_1.varchar)("email", { length: 100 }).notNull().unique(),
    password: (0, pg_core_1.text)("password").notNull(),
    emailVerified: (0, pg_core_1.boolean)("email_verified").default(false),
    contactVerified: (0, pg_core_1.boolean)("contact_verified").default(false),
    loyaltyPoints: (0, pg_core_1.smallint)("loyalty_points").default(10).notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at", {
        withTimezone: true,
        precision: 3,
    })
        .notNull()
        .defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at", {
        withTimezone: true,
        precision: 3,
    })
        .notNull()
        .$onUpdate(() => new Date()),
});
//# sourceMappingURL=users_schema.js.map