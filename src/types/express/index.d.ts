import express from "express";

declare global {
  namespace Express {
    interface Request {
      user?: Parital<User> | string
      newToken?: string
    }
  }
}