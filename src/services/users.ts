import { User, UserWithToken, JwtConfig } from "../types";
import { UserRepository } from "../database/repository/users";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

import twilio from "twilio";
; // Or, for ESM: import twilio from "twilio";

// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export class Users {
  private repository: any;
  constructor() {
    this.repository = new UserRepository();
  }

  //sign up only for customers
  async postSignup(customer: User) {
    let { firstName, lastName, contact, email, password, role } = customer;
    const hash = await bcrypt.hash(password as string, 10);
    password = hash;
    this.repository.createUser({
      firstName,
      lastName,
      contact,
      email,
      password,
      role,
    });
    return { status: "sucess" };
  }

  async verifyOtp(phoneNumber: string){
    const accountSid = process.env.TWILIO_ACCOUNT_SID as string;
    const authToken = process.env.TWILIO_AUTH_TOKEN as string;
    const client = twilio(accountSid, authToken);
    const verification = await client.verify.v2
    .services(accountSid)
    .verifications.create({
      channel: "sms",
      to: "+15017122661",
    });
  }
  //works for sign in of users of all types of roles
  async postSignIn(customer: {
    email: string;
    password: string;
  }): Promise<User | { message: string }> {
    let { email, password } = customer;
    let response: User = await this.repository.findUser({ email });
    const checkPassword: boolean = await bcrypt.compare(
      password,
      response.password as string
    );
    if (checkPassword) {
      const data = {
        id: response.id,
      };
      const jwtConfig : JwtConfig= {
        audience: 'restrosync',
        issuer: 'zyptec pvt ltd',
        subject: response.email ,
        expiresIn:  "7d",
      }
      let signedToken : string = jwt.sign(
        data,
        process.env.JWT_SECRET as string,
        jwtConfig
      );

      const responseData : UserWithToken = {
        firstName: response.firstName,
        lastName: response.lastName,
        email: response.email,
        role: response.role,
        contact: response.contact,
        token: signedToken
      }
      return responseData;
    }
    return {
      message: "Invalid email or password",
    };
  }
}
