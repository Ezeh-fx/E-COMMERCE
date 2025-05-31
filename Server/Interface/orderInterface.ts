import { Document, Schema } from "mongoose";

export interface Ioder extends Document {
  user: Schema.Types.ObjectId;
  name: string;
  email: string;
  address: any;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  status?: "pending" | "paid" | "failed";
  createdAt: Date;
}

// export interface Item {
//   productId: Schema.Types.ObjectId;
//   quantity: string;
// }

// export interface Ioder extends Document {
//   user: Schema.Types.ObjectId;
//   createdAt: Date;
//   total: number;
//   items: Item[];
//   address: string;
// }
