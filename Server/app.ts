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
// import session from "express-session";

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

  // app.use(
  //   session({
  //     secret: process.env.Session_Secret,
  //     resave: false,
  //     saveUninitialized: true,
  //     cookie: { secure: false }, // Set to true in production with HTTPS
  //   })
  // )

  app.use(limiter);

  app.use("/api", UserRoute);
  app.use("/api/product", ProductRoute);
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
