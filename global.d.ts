import { JwtPayload } from "jsonwebtoken";
import { JwtConfig, JwtPayloadData, User } from "./src/types";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayloadData,
      newToken?: string
    }
  }
}
