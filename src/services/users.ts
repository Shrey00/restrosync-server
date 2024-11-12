import { User, UserWithToken, JwtConfig } from "../types";
import { UserRepository } from "../database/repository/users";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { handler, AppError } from "../utils/ErrorHandler";
import { Request, Response } from "express";
import formatResponse from "../utils/formatResponse";
// import twilio from "twilio";
// ; // Or, for ESM: import twilio from "twilio";

// // Find your Account SID and Auth Token at twilio.com/console
// // and set the environment variables. See http://twil.io/secure
// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const client = twilio(accountSid, authToken);

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

  // async verifyOtp(phoneNumber: string){
  //   const accountSid = process.env.TWILIO_ACCOUNT_SID as string;
  //   const authToken = process.env.TWILIO_AUTH_TOKEN as string;
  //   const client = twilio(accountSid, authToken);
  //   const verification = await client.verify.v2
  //   .services(accountSid)
  //   .verifications.create({
  //     channel: "sms",
  //     to: "+15017122661",
  //   });
  // }
  //works for sign in of users of all types of roles
  async postSignIn(
    req: Request,
    res: Response
  ): Promise<UserWithToken[] | void> {
    console.log(req.body);
    let {
      email,
      password,
      contact,
    }: { email: string; password: string; contact: string } = req.body;

    const userAgent = req.headers["user-agent"] as string;

    const isWebBrowser: boolean = /Mozilla|Chrome|Safari|Edge|Firefox/i.test(
      userAgent
    );

    const isAndroidApp: boolean = /Android/i.test(userAgent) && !isWebBrowser;

    const isIOSApp: boolean =
      /iPhone|iPad|iPod/i.test(userAgent) && !isWebBrowser;
    let response: User = await this.repository.findUserByEmail({ email });
    const checkPassword: boolean = await bcrypt.compare(
      password,
      response.password as string
    );
    if (checkPassword) {
      const data = {
        id: response.id,
      };
      let jwtConfig: JwtConfig = {
        audience: "restrosync",
        issuer: "zyptec pvt ltd",
        subject: response.email,
        expiresIn: "2s",
      };
      let signedToken: string = jwt.sign(
        data,
        process.env.JWT_SECRET as string,
        jwtConfig
      );

      jwtConfig.expiresIn = "1y";
      let refreshToken: string = jwt.sign(
        data,
        process.env.JWT_SECRET as string,
        jwtConfig
      );

      const responseData: Array<UserWithToken> = [
        {
          firstName: response.firstName,
          lastName: response.lastName,
          email: response.email,
          role: response.role,
          contact: response.contact,
          countryCode: response.countryCode,
          loyaltyPoints: response.loyaltyPoints,
          refreshToken: refreshToken,
          token: signedToken,
        },
      ];
      if (isWebBrowser) {
        res.cookie("refreshToken", refreshToken, {
          secure: true,
          httpOnly: false,
          sameSite: "none",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
      }
      return responseData;
    } else {
      throw new AppError(
        401,
        "Unauthorized: Please check your email/password",
        "Wrong email or password",
        true
      );
    }
  }
  async getUser({ id }: { id?: string }) {
    let data: User[] = await this.repository.findUserById({ id });
    return [data];
  }
}
