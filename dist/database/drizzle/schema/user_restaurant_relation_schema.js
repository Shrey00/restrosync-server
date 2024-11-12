"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.relationUsersRestaurants = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const restaurants_schema_1 = require("./restaurants_schema");
const users_schema_1 = require("./users_schema");
exports.relationUsersRestaurants = (0, pg_core_1.pgTable)("relation_users_restaurants", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    userId: (0, pg_core_1.uuid)("user_id").references(() => users_schema_1.users.id),
    restaurantId: (0, pg_core_1.uuid)("restaurant_id").references(() => restaurants_schema_1.restaurants.id)
});
//# sourceMappingURL=user_restaurant_relation_schema.js.map