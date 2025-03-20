import express, {
  Request,
  Response,
  NextFunction,
  urlencoded,
  Application,
} from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import { AppError, HttpCode } from "./error/errorDefine";
import { errorhandler } from "./error/errorHandler";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import UserRoute from "./router/userRouter";
import ProductRoute from "./router/productRouter";
import OrderRoute from "./router/orderRouter";
import cookieSession from "cookie-session";
import passport from "passport";
import oAuth from "./router/OAuth";

export const mainApp = (app: Application) => {
  app.use(cors());

  app.use(helmet());
  // app.use(morgan("dev"));
  app.use(urlencoded({ extended: true }));
  app.use(express.json());

  app.set("view engine", "ejs");
  app.use(express.static("public"));
  app.use(express.static(`${__dirname}/public/css`));

  app.use(mongoSanitize());

  const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: "Too many requests from this IP, please try again after an hour",
  });

  app.use(
    cookieSession({
      name: `${process.env.SESSION_NAME}`,
      keys: [`${process.env.SESSION_KEY}`],
      maxAge: 2 * 60 * 60 * 100,
    }),
  )

  .use(function (req: any, res: Response, next: NextFunction) {
    if (req.session && !req.session.regenerate) {
      req.session.regenerate = (cb: any) => {
        cb();
      };
    }
    if (req.session && !req.session.save) {
      req.session.save = (cb: any) => {
        cb();
      };
    }
    next();
  })
  .use(passport.initialize())
  .use(passport.session())

  app.use(limiter);

  app.use("/api", UserRoute);
  app.use("/api/product", ProductRoute);
  app.use("/", oAuth)
  app.use("/api/order", OrderRoute);

  app.get("/", (req: Request, res: Response) => {
    res.status(HttpCode.OK).json({ message: "Welcome to my API! 🚀" });
  });

  app.all("*", (req: Request, res: Response, next: NextFunction) => {
    return next(
      new AppError({
        message: `This route  doesn't exist ☠️☠️☠️`,
        httpCode: HttpCode.NOT_FOUND,
      })
    );
  });
  //    error middlewareapp.use()
  app.use(errorhandler);
};
