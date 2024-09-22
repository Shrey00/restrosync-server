import { Request, Response } from "express";
import { Router } from "express";
import { Users } from "../services";
const app = Router();
const users = new Users();
app.post("/signup", async (req: Request, res: Response) => {
  const response = await users.postSignup(req.body);
  res.status(200).json(response);
});
app.post("/signin", async (req: Request, res: Response) => {
  const response = await users.postSignIn(req.body);
  res.status(200).json(response);
});
export default app;
//delivery signup -> delivery management side app.
//consumer signup -> public app.
//admin and other manager signup -> occurs through this app, and web admin panel
