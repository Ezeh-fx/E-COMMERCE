import { Document, model, Schema } from "mongoose";
import { Ioder } from "../Interface/orderInterface";

interface Allorder extends Ioder, Document {}

const orderSchema = new Schema<Ioder>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  address: Object,
  items: [
    {
      name: String,
      quantity: Number,
      price: Number,
    },
  ],
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  total: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending",
  },
});

export const Order = model<Allorder>("Order", orderSchema);
