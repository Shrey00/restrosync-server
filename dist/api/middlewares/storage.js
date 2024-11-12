"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.menuUpload = exports.userUpload = exports.restaurantUpload = void 0;
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const RestaurantStorage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        try {
            const destPath = path_1.default.join(process.cwd(), '/assets/restaurant');
            // Ensure the destination directory exists
            if (!fs_1.default.existsSync(destPath)) {
                fs_1.default.mkdirSync(destPath, { recursive: true });
            }
            cb(null, destPath);
        }
        catch (error) {
            console.error("Error in setting destination: ", error);
            // cb(new Error('Failed to set destination for file storage.'),process.cwd());
        }
    },
    filename: function (req, file, cb) {
        try {
            const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e6);
            const filename = file.fieldname + "-" + uniqueSuffix;
            cb(null, filename);
        }
        catch (error) {
            console.error("Error in generating filename: ", error);
            // cb(new Error('Failed to generate filename.'), process.cwd());
        }
    },
});
const UserStorage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "/assets/user");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e6);
        cb(null, file.fieldname + "-" + uniqueSuffix);
    },
});
const MenuStorage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        try {
            const destPath = path_1.default.join(process.cwd(), '/assets/menu');
            // Ensure the destination directory exists
            if (!fs_1.default.existsSync(destPath)) {
                fs_1.default.mkdirSync(destPath, { recursive: true });
            }
            cb(null, destPath);
        }
        catch (error) {
            console.error("Error in setting destination: ", error);
            // cb(new Error('Failed to set destination for file storage.'),process.cwd());
        }
    },
    filename: function (req, file, cb) {
        try {
            const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e6);
            const filename = file.fieldname + "-" + uniqueSuffix;
            cb(null, filename);
        }
        catch (error) {
            console.error("Error in generating filename: ", error);
            // cb(new Error('Failed to generate filename.'), process.cwd());
        }
    },
});
exports.restaurantUpload = (0, multer_1.default)({ storage: RestaurantStorage });
exports.userUpload = (0, multer_1.default)({ storage: UserStorage });
exports.menuUpload = (0, multer_1.default)({ storage: MenuStorage });
//# sourceMappingURL=storage.js.map