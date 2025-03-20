import { Document, Schema } from "mongoose";

export interface Iuser extends Document {
  Firstname : string;
  Lastname : string;
  Username : string;
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
