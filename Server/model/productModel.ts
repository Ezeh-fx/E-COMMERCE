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
    // productImage: {
    //   type: [String], // Array of image URLs
    //   validate: [
    //     (val: string[]) => val.length <= 5,
    //     "Maximum 5 images allowed",
    //   ],
    //   required: true,
    // },
    category: {
      type: String,
      required: true,
      enum: [
        category.all,
        category.books,
        category.electronics,
        category.mensWear,
        category.mobliePhones,
        category.womensWear,
      ],
      message: `please enter a category as supplied: ${category.all},${category.books},${category.electronics},${category.mensWear},${category.mobliePhones},${category.womensWear}`,
      default: `${category.all}`,
    },
    rating: {
      type: Number,
      default: 0,
    },
    numberOfReviews: {
      type: Number,
      default: 0,
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
