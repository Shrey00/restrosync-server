export interface AddressType {
  userId: string;
  address_line_1: string;
  address_line_2?: string; // optional
  city: string;
  state: string;
  country: string;
  postalCode: string;
  type: string;
  location?: { latitude: number; longitude: number };
}
