"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.relationRestaurantsUsers = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const restaurants_schema_1 = require("./restaurants_schema");
const offers_schema_1 = require("./offers_schema");
exports.relationRestaurantsUsers = (0, pg_core_1.pgTable)("relation_restaurants_offers", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    offerId: (0, pg_core_1.uuid)("offer_id").references(() => offers_schema_1.offers.id, {
        onDelete: "cascade",
    }),
    restaurantId: (0, pg_core_1.uuid)("restaurant_id").references(() => restaurants_schema_1.restaurants.id),
});
//# sourceMappingURL=restaurants_offers_relation.js.map