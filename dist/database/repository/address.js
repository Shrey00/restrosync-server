"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressRepository = void 0;
const address_schema_1 = require("../drizzle/schema/address_schema");
const connection_1 = __importDefault(require("../connection"));
const drizzle_orm_1 = require("drizzle-orm");
const ErrorHandler_1 = require("../../utils/ErrorHandler");
class AddressRepository {
    insertAddress(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, address_line_1, address_line_2, city, state, country, postalCode, location, type, } = params;
            try {
                const response = yield connection_1.default
                    .insert(address_schema_1.address)
                    .values({
                    userId,
                    address_line_1,
                    address_line_2,
                    city,
                    state,
                    country,
                    postalCode,
                    location,
                    type,
                })
                    .returning({
                    id: address_schema_1.address.id,
                    address_line_1: address_schema_1.address.address_line_1,
                    address_line_2: address_schema_1.address.address_line_2,
                    city: address_schema_1.address.city,
                    state: address_schema_1.address.state,
                    country: address_schema_1.address.country,
                    postalCode: address_schema_1.address.postalCode,
                    location: address_schema_1.address.location,
                    type: address_schema_1.address.type,
                });
                return response;
            }
            catch (e) {
                if (e instanceof Error)
                    throw new ErrorHandler_1.AppError(500, e === null || e === void 0 ? void 0 : e.message, "DB error", true);
            }
        });
    }
    updateAddress(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield connection_1.default
                    .update(address_schema_1.address)
                    .set(params)
                    .returning({
                    id: address_schema_1.address.id,
                    userId: address_schema_1.address.userId,
                    address_line_1: address_schema_1.address.address_line_1,
                    address_line_2: address_schema_1.address.address_line_2,
                    city: address_schema_1.address.city,
                    state: address_schema_1.address.state,
                    country: address_schema_1.address.country,
                    postalCode: address_schema_1.address.postalCode,
                    location: address_schema_1.address.location,
                    selected: address_schema_1.address.selected,
                });
                return response;
            }
            catch (e) {
                if (e instanceof Error)
                    throw new ErrorHandler_1.AppError(500, e === null || e === void 0 ? void 0 : e.message, "DB error", true);
            }
        });
    }
    updateAddressSelect(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield connection_1.default.transaction((txn) => __awaiter(this, void 0, void 0, function* () {
                    yield txn
                        .update(address_schema_1.address)
                        .set({ selected: false })
                        .where((0, drizzle_orm_1.sql) `${address_schema_1.address.userId}=${params.userId}`);
                    const response = yield txn
                        .update(address_schema_1.address)
                        .set({ selected: true })
                        .where((0, drizzle_orm_1.sql) `${address_schema_1.address.id}=${params.addressId}`)
                        .returning({ addressId: address_schema_1.address.id });
                    return response;
                }));
                return response;
            }
            catch (e) {
                if (e instanceof Error)
                    throw new ErrorHandler_1.AppError(500, e === null || e === void 0 ? void 0 : e.message, "DB error", true);
            }
        });
    }
    findAddressesByEntityId(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield connection_1.default
                    .select()
                    .from(address_schema_1.address)
                    .where((0, drizzle_orm_1.sql) `${address_schema_1.address.userId}=${params.userId}`);
                return response;
            }
            catch (e) {
                if (e instanceof Error)
                    throw new ErrorHandler_1.AppError(500, e === null || e === void 0 ? void 0 : e.message, "DB error", true);
            }
        });
    }
}
exports.AddressRepository = AddressRepository;
//# sourceMappingURL=address.js.map