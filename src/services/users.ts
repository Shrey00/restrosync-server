import { User, UserWithToken, JwtConfig } from "../types";
import { UserRepository } from "../database/repository/users";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { handler, AppError } from "../utils/ErrorHandler";
import { Request, Response } from "express";
import formatResponse from "../utils/formatResponse";

import twilio from "twilio";
import "dotenv/config";
import { error } from "console";

export class Users {
  private repository: any;
  private client: any;

  constructor() {
    this.repository = new UserRepository();
    this.client = twilio(
      process.env.TWILIO_ACCOUNT_SID!,
      process.env.TWILIO_AUTH_TOKEN!
    );
  }

  //sign up only for customers
  async postSignup(customer: any) {
    let { firstName, lastName, phone, email, password } = customer;
    console.log(password);
    console.log(customer);

    const hash = await bcrypt.hash(password as string, 10);
    password = hash;
    const response = await this.repository.createUser({
      firstName,
      lastName,
      contact: phone,
      email,
      password,
      contactVerified: true,
    });

    const data = {
      id: response.id,
    };
    let jwtConfig: JwtConfig = {
      audience: "restrosync",
      issuer: "zyptec pvt ltd",
      subject: response.email,
      expiresIn: "1y",
    };
    let signedToken: string = jwt.sign(
      data,
      process.env.JWT_SECRET as string,
      jwtConfig
    );
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
    return responseData;
  }

  async postSignIn(req: Request, res: Response): Promise<any> {
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
    if (!response)
      return {
        statusCode: 401,
        name: "Unauthorized",
        desc: "Wrong email or password",
      };
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
        expiresIn: "1y",
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

  async getUserByPhone(params: { contact: string }) {
    let data = await this.repository.findUserByContact(params);
    return data;
  }

  async deleteAccount(params: { userId: string }) {
    const response = await this.repository.patchAccountActiveStatus({
      userId: params.userId,
    });
    return response;
  }

  /**
   * Send an OTP via Twilio Verify Service
   * @param phone - Phone number to send the OTP
   * @returns {Promise<{ message: string }>}
   */
  async sendVerificationCode(phone: string): Promise<{ message: string }> {
    const response = await this.client.verify.v2
      .services("VAa1cad9454e7d4f80f443f9009ab24fe2")
      .verifications.create({ to: "+91" + phone, channel: "sms" });
    if (response.status === "pending") {
      return { message: "OTP sent successfully" };
    } else {
      throw new Error("Failed to send OTP");
    }
  }
  /**
   * Verify the OTP using Twilio Verify Service
   * @param phone - Phone number to verify
   * @param otp - OTP to verify
   * @returns {Promise<any>}
   */
  async verifyCode(phone: string, otp: string): Promise<any> {
    const response = await this.client.verify.v2
      .services("VAa1cad9454e7d4f80f443f9009ab24fe2")
      .verificationChecks.create({ to: "+91" + phone, code: otp });
    return response;
  }

  async postSignInWithPhone(
    phone: string,
    otp: string
  ): Promise<Array<UserWithToken>> {
    const response = await this.getUserByPhone({ contact: phone });
    const data = {
      id: response.id,
    };
    let jwtConfig: JwtConfig = {
      audience: "restrosync",
      issuer: "zyptec pvt ltd",
      subject: response.email,
      expiresIn: "1y",
    };
    let signedToken: string = jwt.sign(
      data,
      process.env.JWT_SECRET as string,
      jwtConfig
    );
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
    return responseData;
  }
}
