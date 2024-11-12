import { Request, Response, NextFunction } from "express";
import multer from "multer";
import fs from 'fs';
import path from 'path';
const RestaurantStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    try {
      const destPath = path.join(process.cwd(), '/assets/restaurant');
      
      // Ensure the destination directory exists
      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath, { recursive: true });
      }

      cb(null, destPath);
    } catch (error) {
      console.error("Error in setting destination: ", error);
      // cb(new Error('Failed to set destination for file storage.'),process.cwd());
    }
  },
  filename: function (req, file, cb) {
    try {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e6);
      const filename = file.fieldname + "-" + uniqueSuffix;
      cb(null, filename);
    } catch (error) {
      console.error("Error in generating filename: ", error);
      // cb(new Error('Failed to generate filename.'), process.cwd());
    }
  },
});
const UserStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/assets/user");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e6);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const MenuStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    try {
      const destPath = path.join(process.cwd(), '/assets/menu');
      
      // Ensure the destination directory exists
      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath, { recursive: true });
      }

      cb(null, destPath);
    } catch (error) {
      console.error("Error in setting destination: ", error);
      // cb(new Error('Failed to set destination for file storage.'),process.cwd());
    }
  },
  filename: function (req, file, cb) {
    try {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e6);
      const filename = file.fieldname + "-" + uniqueSuffix;
      cb(null, filename);
    } catch (error) {
      console.error("Error in generating filename: ", error);
      // cb(new Error('Failed to generate filename.'), process.cwd());
    }
  },
});
export const restaurantUpload = multer({ storage: RestaurantStorage });
export const userUpload = multer({ storage: UserStorage });
export const menuUpload = multer({ storage: MenuStorage });