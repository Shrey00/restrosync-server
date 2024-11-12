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
exports.UserRepository = void 0;
const users_schema_1 = require("../drizzle/schema/users_schema");
const connection_1 = __importDefault(require("../connection"));
const drizzle_orm_1 = require("drizzle-orm");
const ErrorHandler_1 = require("../../utils/ErrorHandler");
class UserRepository {
    createUser(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { firstName, lastName, contact, countryCode, email, password, role } = params;
            try {
                const response = yield connection_1.default
                    .insert(users_schema_1.users)
                    .values({
                    firstName,
                    lastName,
                    contact,
                    countryCode,
                    email,
                    password,
                    role,
                })
                    .returning({
                    firstName: users_schema_1.users.firstName,
                    lastName: users_schema_1.users.lastName,
                    email: users_schema_1.users.email,
                    role: users_schema_1.users.role,
                    contact: users_schema_1.users.contact,
                    countryCode: users_schema_1.users.countryCode,
                });
                return response[0];
            }
            catch (e) {
                if (e instanceof Error)
                    throw new ErrorHandler_1.AppError(500, e === null || e === void 0 ? void 0 : e.message, "DB error", true);
            }
        });
    }
    findUserByEmail(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = params;
            try {
                const data = yield connection_1.default
                    .select()
                    .from(users_schema_1.users)
                    .where((0, drizzle_orm_1.sql) `${users_schema_1.users.email} = ${email}`);
                if (data.length)
                    return data[0];
                throw new ErrorHandler_1.AppError(404, "Not Found", "User not found, please check the credentials", true);
            }
            catch (e) {
                if (e instanceof Error)
                    throw new ErrorHandler_1.AppError(500, e === null || e === void 0 ? void 0 : e.message, "DB error", false);
            }
        });
    }
    findUserById(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = params;
            try {
                const data = yield connection_1.default
                    .select({
                    firstName: users_schema_1.users.firstName,
                    lastName: users_schema_1.users.lastName,
                    email: users_schema_1.users.email,
                    role: users_schema_1.users.role,
                    contact: users_schema_1.users.contact,
                    countryCode: users_schema_1.users.countryCode,
                })
                    .from(users_schema_1.users)
                    .where((0, drizzle_orm_1.sql) `${users_schema_1.users.id} = ${id}`);
                if (data.length)
                    return data[0];
                throw new ErrorHandler_1.AppError(404, "User not found, please check the userId", "Not Found", true);
            }
            catch (e) {
                if (e instanceof Error)
                    throw new ErrorHandler_1.AppError(500, e === null || e === void 0 ? void 0 : e.message, "DB error", false);
            }
        });
    }
    findUserByContact(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { contact } = params;
            try {
                const data = yield connection_1.default
                    .select()
                    .from(users_schema_1.users)
                    .where((0, drizzle_orm_1.sql) `${users_schema_1.users.contact} = ${contact}`);
                if (data.length)
                    return data[0];
                throw new ErrorHandler_1.AppError(404, "User not found, please check the credentials", "Not Found", true);
            }
            catch (e) {
                if (e instanceof Error)
                    throw new ErrorHandler_1.AppError(500, e === null || e === void 0 ? void 0 : e.message, "DB error", false);
            }
        });
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=users.js.map