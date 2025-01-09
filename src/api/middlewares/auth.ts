//verify
//sign token
import "dotenv/config";
import { NextFunction, Request, Response } from "express";
import { JwtPayloadData } from "../../types";
import jwt from "jsonwebtoken";
import { TokenExpiredError } from "jsonwebtoken";
import { AppError, handler } from "../../utils/ErrorHandler";
import { JwtConfig } from "../../types";
export async function refreshExpiredToken(
  refreshToken: string
): Promise<{ decoded: JwtPayloadData; newToken: string }> {
  console.log("REFRESH REUIRED BRO", refreshToken)
  const secret: string = process.env.JWT_SECRET as string;
  return new Promise((resolve, reject) => {
    jwt.verify(refreshToken, secret, (err: any, decoded: any) => {
      if (err) {
        reject(err);
      } else {
        let jwtConfig: JwtConfig = {
          audience: "restrosync",
          issuer: "zyptec pvt ltd",
          subject: decoded.sub,
          expiresIn: "1y",
        };
        const data = { id: decoded.id };
        const token = jwt.sign(
          data,
          process.env.JWT_SECRET as string,
          jwtConfig
        );
        resolve({ decoded, newToken: token });
      }
    });
  });
}

export async function auth(req: Request, res: Response, next: NextFunction) {
  const secret: string = process.env.JWT_SECRET as string;
  const userAgent = req.headers["user-agent"] as string;
  const mobilePlatformHeader = req.headers['x-platform'] as string;
  let refreshToken: string;
  console.log(userAgent)
  const isWebBrowser: boolean = /Mozilla|Chrome|Safari|Edge|Firefox/i.test(
    userAgent
  );
  const isAndroidApp: boolean = /android/i.test(mobilePlatformHeader) && !isWebBrowser;
  const isIOSApp: boolean =
    /ios/i.test(mobilePlatformHeader) && !isWebBrowser;

  const authorizationHeader = req.headers["authorization"];
  if (isWebBrowser) refreshToken = req.cookies.refreshToken;
  if (authorizationHeader) {
    const tokenParts = authorizationHeader?.split(" ");
    if (tokenParts.length === 2 && tokenParts[0].toLowerCase() == "bearer") {
      const token = tokenParts[1];
      jwt.verify(token, secret, async (err, decoded) => {
        if (err instanceof TokenExpiredError) {
          //for creating a separate route of refreshing token, if it is a mobile app.
          
          if (isAndroidApp || isIOSApp) {
            res.status(401).json({ tokenErr: "expired" });
          }

          if (refreshToken) {
            const refreshed: { decoded: JwtPayloadData; newToken: string } =
              await refreshExpiredToken(refreshToken);
            if (refreshed.newToken === "error") {
              res.status(401).json({ error: "Unauthorised or Expired Token" });
            }
            req.user = refreshed.decoded;
            req.newToken = refreshed.newToken as string;
            next();
          }
        } else {
          req.user = decoded as JwtPayloadData;
          next();
        }
      });
    }
  } else {
    //@Todo Make a way to redirect to sign in if there is no authorization header
    res.redirect("/signin");
  }
  // return res.status(401).json({ error: "Unauthorized: No token provided" });
}
