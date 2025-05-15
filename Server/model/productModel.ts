import { Document, model, Schema } from "mongoose";
import { Iproducts } from "../Interface/productInterface";
import { category } from "../constant/productCategory";

interface AllProduct extends Iproducts, Document {}

const CommetSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const ProductSchema = new Schema<AllProduct>(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    productImage: {
      type: String,
      required: true,
      max: 5,
    },
    category: {
      type: String,
      required: true,
      enum: [
        category.all,
        category.accessories,
        category.electronics,
        category.mensWear,
        category.mobilePhones,
        category.womensWear,
      ],
      message: `please enter a category as supplied: ${category.all},${category.accessories},${category.electronics},${category.mensWear},${category.mobilePhones},${category.womensWear}`,
      default: `${category.all}`,
    },
    numberOfReviews: {
      type: Number,
      default: 0,
    },
    stock: {
      type: Number,
      required: true,
    },
    dateCreated: {
      type: Date,
      default: Date.now(),
    },
    reviews: [CommetSchema],
  },
  {
    timestamps: true,
  }
);

export const Product = model<AllProduct>("Product", ProductSchema);
