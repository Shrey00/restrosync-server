"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.menuVariants = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const menu_schema_1 = require("./menu_schema");
exports.menuVariants = (0, pg_core_1.pgTable)("menu_item_variants", {
    id: (0, pg_core_1.serial)("id"),
    name: (0, pg_core_1.varchar)("name", { length: 100 }),
    mainItemId: (0, pg_core_1.uuid)("main_item_id").references(() => menu_schema_1.menu.id),
    variantId: (0, pg_core_1.uuid)("variant_id").references(() => menu_schema_1.menu.id),
});
//# sourceMappingURL=menu_variants_schema.js.map