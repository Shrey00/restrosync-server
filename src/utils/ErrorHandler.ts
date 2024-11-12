import { Response } from "express";
type HttpCode = 200 | 300 | 401 | 404 | 500;
const commonErrorsDict: { resourceNotFound: string; notFound: HttpCode } = {
  resourceNotFound: "Resource not found",
  notFound: 404,
};
export class AppError extends Error {
  public readonly name: string;
  public readonly httpCode: HttpCode;
  public readonly isOperational: boolean;
  public readonly description: string;

  constructor(
    httpCode: HttpCode,
    name: string,
    description: string,
    isOperational: boolean
  ) {
    super(description);

    Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain

    this.name = name;
    this.httpCode = httpCode;
    this.isOperational = isOperational;
    this.description = description;
    Error.captureStackTrace(this);
  }
}

class ErrorHandler {
  public async handleError(err: AppError, req: Request,res: Response) {
    res?.status(err.httpCode).json({type: "error", message: err.description});
    // await logger.logError(error);
    // await fireMonitoringMetric(error);
    // await crashIfUntrustedErrorOrSendResponse(error, responseStream);
  }
}

export const handler = new ErrorHandler();
