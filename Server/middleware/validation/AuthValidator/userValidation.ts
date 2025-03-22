import { NextFunction, RequestHandler, Request, Response } from "express";
import { validate } from "../validation";
import { userSchemaValidator } from "./registerSchema";


export const registerValidation :  RequestHandler= (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    validate(userSchemaValidator.register , req.body , next)
    
}

export const loginValidation : RequestHandler = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    validate(userSchemaValidator.login , req.body , next)
}