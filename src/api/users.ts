import { NextFunction, Request, Response } from "express";
import { Router } from "express";
import { Users } from "../services";
import { auth } from "./middlewares/auth";
import { User } from "../types";
import formatResponse from "../utils/formatResponse";
import { JwtPayload } from "jsonwebtoken";
import { refreshExpiredToken } from "./middlewares/auth";

const app = Router();
const users = new Users();

app.post("/signup", async (req: Request, res: Response, next: NextFunction) => {
  const response = await users.postSignup(req.body);
  res.status(200).json(response);
});
app.post("/signin", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await users.postSignIn(req, res);
    const response = formatResponse(null, data)
    if (data.statusCode === 401) res.status(401).json(data);    
    res.status(200).json(response);
  } catch (e) {
    next(e);
  }
});

app.post(
  "/send-otp-login",
  async (req: Request, res: Response, next: NextFunction) => {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ error: "Phone number is required" });
    }
    try {
      const user = await users.getUserByPhone({ contact: req.body.phone });
      if (user) {
        const result = await users.sendVerificationCode(phone);
        return res.status(200).json(result);
      }
      return res
        .status(200)
        .json({ desc: "Phone number not found", statusCode: 401 });
    } catch (error: any) {
      next(error);
    }
  }
);
app.post(
  "/send-otp-signup",
  async (req: Request, res: Response, next: NextFunction) => {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ error: "Phone number is required" });
    }
    try {
      const result = await users.sendVerificationCode(phone);
      return res.status(200).json(result);
    } catch (error: any) {
      next(error);
    }
  }
);

// Route to verify OTP
app.post(
  "/verify-otp-login",
  async (req: Request, res: Response, next: NextFunction) => {
    const { phone, otp } = req.body;
    if (!phone || !otp) {
      return res
        .status(400)
        .json({ error: "Phone number and OTP are required" });
    }
    try {
      const response = await users.verifyCode(phone, otp);
      if (response.valid && response.status === "approved") {
        const data = await users.postSignInWithPhone(phone, otp);
        return res.status(200).json(data);
      } else {
        return res.status(200).json({ statusCode: 400, error: "Invalid OTP" });
      }
    } catch (error: any) {
      next(error);
    }
  }
);
app.post(
  "/verify-otp-signup",
  async (req: Request, res: Response, next: NextFunction) => {
    const { phone, otp } = req.body;
    console.log("BODY")
    console.log(req.body)
    if (!phone || !otp) {
      return res
        .status(400)
        .json({ error: "Phone number and OTP are required" });
    }
    try {
      const response = await users.verifyCode(phone, otp);
      if (response.valid && response.status === "approved") {
        const data = await users.postSignup(req.body);
        return res.status(200).json(data);
      } else {
        return res.status(200).json({ statusCode: 400, error: "Invalid OTP" });
      }
    } catch (error: any) {
      next(error);
    }
  }
);

app.patch(
  "/delete-account",
  auth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await users.deleteAccount({
        userId: req.user?.id as string,
      });
      const response = formatResponse(null, data);
      res.status(200).json(response);
    } catch (e) {
      next(e);
    }
  }
);

app.get(
  "/user",
  auth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let response: { data: Array<User>; newToken?: null | string };
      console.log(req.user);
      const data = await users.getUser({ id: req.user?.id });
      response = formatResponse(req.newToken, data);
      res.status(200).json(response);
    } catch (e) {
      next(e);
    }
  }
);

app.post("/refresh-token", async (req: Request, res: Response) => {
  const refreshed: { decoded: JwtPayload; newToken: string } =
    await refreshExpiredToken(req.body.refreshToken);
  res.status(200).json({ newToken: refreshed.newToken });
});
export default app;
//delivery signup -> delivery management side app.
//consumer signup -> public app.
//admin and other manager signup -> occurs through this app, and web admin panel
