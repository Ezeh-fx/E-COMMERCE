import { NextFunction } from "express";
import Joi from "joi";
import { AppError, HttpCode } from "../../error/errorDefine";


export const validate = (
    schemaName: Joi.ObjectSchema,
    body: object,
    next: NextFunction
) => {
    const value = schemaName.validate(body, {
        allowUnknown: true,
        abortEarly: false,
        stripUnknown: true,
    });

    try {
        if (value.error) {
            return next(
                new AppError({
                    message: value.error.details.map((err) => err.message).join(", "),  // 🛠 Show validation error messages
                    httpCode: HttpCode.UNPROCESSABLE_IDENTITY,
                })
            );
        }
        next();
    } catch (error: any) {
        next(
            new AppError({
                httpCode: HttpCode.BAD_REQUEST,
                message: error.message || "Validation error",
            })
        );
    }
};