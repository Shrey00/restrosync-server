import { AddressRepository } from "../database/repository";
import { AddressType } from "../types";

export class Address {
  private repository: any;
  constructor() {
    this.repository = new AddressRepository();
  }
  async postAddress(params: AddressType) {
    const response = await this.repository.insertAddress(params);
    return response;
  }
  async patchAddress(params: Partial<AddressType>) {
    const response = await this.repository.updateAddress(params);
    return response;
  }
  async getAddresses(params: { userId: string }) {
    const response = await this.repository.findAddressesByEntityId(params);
    return response;
  }
}
