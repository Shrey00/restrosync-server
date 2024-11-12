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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Address = void 0;
const repository_1 = require("../database/repository");
class Address {
    constructor() {
        this.repository = new repository_1.AddressRepository();
    }
    postAddress(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.repository.insertAddress(params);
            return response;
        });
    }
    patchAddress(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.repository.updateAddress(params);
            return response;
        });
    }
    getAddresses(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.repository.findAddressesByEntityId(params);
            return response;
        });
    }
}
exports.Address = Address;
//# sourceMappingURL=address.js.map