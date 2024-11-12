"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.AppError = void 0;
const commonErrorsDict = {
    resourceNotFound: "Resource not found",
    notFound: 404,
};
class AppError extends Error {
    constructor(httpCode, name, description, isOperational) {
        super(description);
        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
        this.name = name;
        this.httpCode = httpCode;
        this.isOperational = isOperational;
        this.description = description;
        Error.captureStackTrace(this);
    }
}
exports.AppError = AppError;
class ErrorHandler {
    handleError(err, req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res === null || res === void 0 ? void 0 : res.status(err.httpCode).json({ type: "error", message: err.description });
            // await logger.logError(error);
            // await fireMonitoringMetric(error);
            // await crashIfUntrustedErrorOrSendResponse(error, responseStream);
        });
    }
}
exports.handler = new ErrorHandler();
//# sourceMappingURL=ErrorHandler.js.map