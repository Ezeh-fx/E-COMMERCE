import { Document, model, Schema } from "mongoose";
import { Iuser } from "../Interface/userInterface";
import isEmail from "validator/lib/isEmail";
import { authRole } from "../constant/userRole";
import { Types } from "mongoose";

interface AllUsers extends Iuser, Document {
  clearCart(): Promise<void>;
  RemoveCart(productID: string): Promise<void>;
  addToCart(productID: string, quantity: number): Promise<boolean>;
}

const UserSchema = new Schema<AllUsers>(
  {
    firstname: {
      type: String,
      required: [true, "Your Firstname is required"],
    },
    lastname: {
      type: String,
      required: [true, "Your Lastname is required"],
    },
    username: {
      type: String,
      required: [true, "Your Username is required"],
    },
    email: {
      type: String,
      required: [true, "Your email is required"],
      trim: true,
      lowercase: true,
      unique: true,
      validate: [isEmail, "Input a vaild email"],
    },
    password: {
      type: String,
      required: true,
      minlength: [6, "Password should be at least 6 letters"],
    },
    confirmPassword: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: [authRole.admin, authRole.user],
      default: `${authRole.user}`,
      meaasge: `Please identify your role as provided:${authRole.admin},${authRole.user}`,
    },
    cart: {
      items: [
        {
          productId: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: [true, "Please select a product"],
          },
          quantity: {
            type: Number,
            required: [true, "Please select a product"],
          },
        },
      ],
    },
    orders: [
      {
        type: Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
    verify: {
      type: Boolean,
      default: false,
    },
    profileImages: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2017/11/10/05/48/user-2935527_960_720.png",
    },
    OTPExpiry: {
      type: String,
    },
    OtpCode: {
      type: Number,
    },
    pushSubscripition : {
      type: String, 
    }
  },
  { timestamps: true }
);

UserSchema.methods.addToCart = function (
  productId: string,
  quantity: number = 1
): Promise<void> {
  const cartProductIndex = this.cart.items.findIndex(
    (item: { productId: { toString: () => string } }) =>
      item.productId.toString() === productId.toString()
  );

  if (cartProductIndex >= 0) {
    this.cart.items[cartProductIndex].quantity += quantity;
  } else {
    this.cart.items.push({
      productId,
      quantity,
    });
  }

  return this.save({ validateBeforeSave: false });
};

// Remove a single product from the cart
UserSchema.methods.RemoveCart = function (productId: string): Promise<typeof this> {
  if (!this.cart?.items) {
    return Promise.resolve(this);
  }

  this.cart.items = this.cart.items.filter(
    (item: { productId: Types.ObjectId }) =>
      item.productId.toString() !== productId.toString()
  );

  return this.save({ validateBeforeSave: false });
};

// Clear all items from the cart
UserSchema.methods.clearCart = function (): Promise<typeof this> {
  this.cart.items = [];
  return this.save({ validateBeforeSave: false });
};

export const User = model<AllUsers>("User", UserSchema);
