import { Request, Response, NextFunction } from "express";
import { authRole } from "../../constant/userRole";
import { AppError, HttpCode } from "../../error/errorDefine";
import { Iuser } from "../../Interface/userInterface";

export const isAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.body.userData as Iuser ; 

  const adminUser = user && user.role === authRole.admin;

  if (!adminUser) {
    return next(
      new AppError({
        message: "Unauthorized to hit this route",
        httpCode: HttpCode.UNAUTHORIZED,
      })
    );
  }

  next();
};
