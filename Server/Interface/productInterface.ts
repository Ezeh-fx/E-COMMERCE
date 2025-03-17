import { Document, Schema } from "mongoose";

export interface Review {
  user: Schema.Types.ObjectId;
  name: string;
  rating: number;
  comment: string;
}

export interface Iproducts extends Document {
  name: string;
  price: number;
  category: string;
  rating: number;
  productImage: string;
  // productImage: string[];
  numberOfReviews: number;
  dateCreated: Date;
  reviews: Review[];
}
