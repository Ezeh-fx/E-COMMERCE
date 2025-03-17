import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload, Secret, VerifyErrors } from "jsonwebtoken";
import { envVaraibles } from "../../env/environmentVar";
import { AppError, HttpCode } from "../../error/errorDefine";
import { User } from "../../model/userModel";
import { Iuser } from "../../Interface/userInterface";

interface Payload extends JwtPayload {
  _id: unknown ; 
  email: string;
}

import dotenv from "dotenv";
dotenv.config(); // Ensure environment variables are loaded

export const jwtSecret = envVaraibles.JWT_SECRET_KEY;
export const REFRESHSecret = envVaraibles.secretRefreshToken; 

if (!jwtSecret) {
  throw new Error("JWT Secret is missing! Check your .env file.");
}

export const generateToken = (user: Payload) => {
  return jwt.sign(user, jwtSecret as Secret, { expiresIn: "2h" });
};

export const generateRefreshToken = (user: Payload) => {
  return jwt.sign(user, REFRESHSecret as Secret, { expiresIn: "1m" });
};

export const authenticate_token = (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  const headers = req.headers.authorization;

  if (!headers || !headers.startsWith("Bearer ")) {
    return next(
      new AppError({
        message: "No token provided or incorrect format",
        httpCode: HttpCode.UNAUTHORIZED,
      })
    );
  }

  const token: string = headers.split(" ")[1];

  jwt.verify(
    token,
    jwtSecret as Secret,
    async (err: VerifyErrors | null, decodedUser: Payload | any) => {
      if (err) {
        return next(
          new AppError({
            message:
              err.name === "JsonWebTokenError" ? "Invalid Token" : err.message,
            httpCode: HttpCode.UNAUTHORIZED,
          })
        );
      }

      try {
        const verify = await User.findById({
          _id: decodedUser!._id,
        });

        if (!verify) {
          next(
            new AppError({
              httpCode: HttpCode.UNAUTHORIZED,
              message: "Unauthorized users",
            })
          );
        }
        req.body.userData = verify as Iuser;
        next();
      } catch (error) {
        console.error(error);
        return next(
          new AppError({
            httpCode: HttpCode.INTERNAL_SERVER_ERROR,
            message: "Internal Server Error",
          })
        );
      }
    }
  );
};
