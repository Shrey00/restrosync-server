import { Request, Response } from "express";
import { Router } from "express";
import { Users } from "../services";
import { auth } from "./middlewares/auth";
import { User } from "../types";
import formatResponse from "../utils/formatResponse";
import { JwtPayload } from "jsonwebtoken";
import { refreshExpiredToken } from "./middlewares/auth";
const app = Router();
const users = new Users();
app.post("/signup", async (req: Request, res: Response) => {
  const response = await users.postSignup(req.body);
  res.status(200).json(response);
});
app.post("/signin", async (req: Request, res: Response) => {
  const data = await users.postSignIn(req, res);
  const response = formatResponse(null,data);
  res.status(200).json(response);
});

app.get("/user", auth, async (req: Request, res: Response) => {
  console.log("request came")
  let response : { data: Array<User>, newToken?:null | string};
  const data = await users.getUser({ id: req.user?.id });
  response = formatResponse(req.newToken, data);
  res.status(200).json(response);
});

app.post("/refresh-token", async (req: Request, res: Response) => {
  console.log("yeahhha be")
  console.log(req.body)
  console.log(JSON.stringify(req.body))
  const refreshed : {decoded: JwtPayload, newToken: string} = await refreshExpiredToken(req.body.refreshToken);
  res.status(200).json({newToken: refreshed.newToken});
});
export default app;
//delivery signup -> delivery management side app.
//consumer signup -> public app.
//admin and other manager signup -> occurs through this app, and web admin panel
