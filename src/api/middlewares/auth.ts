//verify
//sign token
import "dotenv/config";
import { NextFunction, Request, Response } from 'express';
import { User } from '../../types/users'
import jwt from 'jsonwebtoken';
import { Users } from '../../services/users'
const userService = new Users();

async function auth(req: Request, res: Response, next: NextFunction){
    const secret : string = process.env.JWT_SECRET as string;
    const authorizationHeader = req.headers['authorization'];
    if(authorizationHeader) {
        const tokenParts = authorizationHeader?.split(' ')[1];
        if(tokenParts.length === 2 && tokenParts[0].toLowerCase() == 'bearer') {
            const token = tokenParts[1];
            jwt.verify(token, secret, (err, decoded) => {
                if (err) {
                  return res.status(401).json({ error: 'Unauthorized: Invalid token' });
                }
                next(decoded);
            });
        }
    } else {
        //@Todo Make a way to redirect to sign in if there is no authorization header
        res.redirect('/signin');
    }
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
}