import { Document, Schema } from "mongoose";

export interface Iuser extends Document {
  firstname : string;
  lastname : string;
  username : string;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  OtpCode: number;
  verify: boolean;
  profileImages: string;
  cart?: {
    items: {
      productsId: Schema.Types.ObjectId;
      quantity: number;
    };
  }[];
  orders: Schema.Types.ObjectId;
  role: string;
  OTPExpiry: string;
  pushSubscripition? : string 
}

export interface IauthUser extends Request {
  user: Iuser;
}
