type Address = {
  address: string,
  landmark: string,
  city: string,
  district: string,
}[];

export interface User {
  id?: string,
  firstName: string,
  lastName: string,
  contact: string,
  email: string,
  password?: string,
  role:
    | "customer"
    | "admin"
    | "delivery-agent"
    | "delivery"
    | "sales"
    | "packaging",
  countryCode?: string,
  address?: Address,
  loyaltyPoints?: number,
  createdAt?: Date,
  updatedAt?: Date,
};

export interface UserWithToken extends User {
  token : string
}

export type JwtConfig = {
  audience: string,
  issuer: string,
  subject: string,
  expiresIn:  string,
}
