import { Document, model, Schema } from "mongoose";
import { Ioder } from "../Interface/orderInterface";

interface Allorder extends Ioder, Document {}

const orderSchema = new Schema<Ioder>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: "pending",
    enum: ["pending", "paid", "shipped"],
  },
  paymentMethod: {
    type: String,
    required: true,
    default: "Stripe",
    enum: ["Paypal", "Stripe"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  orderItem: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  city: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  longitude: {
    type: String,
    required: true,
  },
  latitude: {
    type: String,
    required: true,
  },
  zipCode : {
    type: String,
    required: true,
  },
  TimeZone : {
    type: String,
    required: true,
  }
});

export const Order = model<Allorder>("Order", orderSchema);
