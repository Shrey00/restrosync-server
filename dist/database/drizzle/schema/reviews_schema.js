"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviews = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const restaurants_schema_1 = require("./restaurants_schema");
const users_schema_1 = require("./users_schema");
const menu_schema_1 = require("./menu_schema");
exports.reviews = (0, pg_core_1.pgTable)("reviews", {
    id: (0, pg_core_1.uuid)("id").primaryKey().notNull(),
    userId: (0, pg_core_1.uuid)("user_id").references(() => users_schema_1.users.id),
    menuItemId: (0, pg_core_1.uuid)("menu_item_id").references(() => menu_schema_1.menu.id, {
        onDelete: "no action",
    }),
    restaurantId: (0, pg_core_1.uuid)("restaurant_id").references(() => restaurants_schema_1.restaurants.id, {
        onDelete: "no action",
    }),
    rating: (0, pg_core_1.smallint)("rating").notNull(),
    comment: (0, pg_core_1.text)("comment").notNull(),
    parentCommentId: (0, pg_core_1.uuid)("parent_comment_id"),
    createdAt: (0, pg_core_1.timestamp)("created_at", { withTimezone: true, precision: 3 })
        .defaultNow()
        .notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at", { withTimezone: true, precision: 3 })
        .defaultNow()
        .notNull()
        .$onUpdate(() => new Date()),
});
//# sourceMappingURL=reviews_schema.js.map