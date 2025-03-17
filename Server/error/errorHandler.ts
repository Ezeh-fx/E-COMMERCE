import { Request, Response, NextFunction } from "express";
import { AppError, HttpCode } from "./errorDefine";

const Errors = (err: AppError, res: Response) => {
  // const statusCode = err.httpCode || HttpCode.INTERNAL_SERVER_ERROR;
  return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({
    err: err.message,
    status: err.httpCode,
    stack: err.stack,
    error: err,
  });
};

export const errorhandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  Errors(err, res);
};
