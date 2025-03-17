export enum HttpCode {
  OK = 200,
  CREATE = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  CONFLICT = 409,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  UNPROCESSABLE_IDENTITY,
  INTERNAL_SERVER_ERROR = 500,
  FIELD_REQUIRED = 422,
  NOT_ACCEPTABLE = 406,
}

interface ErrorArgs {
  name?: string;
  message: string;
  isOptional?: boolean;
  httpCode: HttpCode;
}

export class AppError extends Error {
  public readonly name: string;
  public readonly isOptional: boolean = true;
  public readonly httpCode: HttpCode;

  constructor(args: ErrorArgs) {
    super(args.message);

    Object.setPrototypeOf(this, new.target.prototype);
    this.name = args.name || "Error";
    this.httpCode = args.httpCode;
    if (typeof args.isOptional !== "undefined") {
      this.isOptional = args.isOptional;
    }

    if ("captureStackTrace" in Error) {
      (Error as any).captureStackTrace(this);
    }
  }
}
