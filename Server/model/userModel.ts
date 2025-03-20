import { Document, model, Schema } from "mongoose";
import { Iuser } from "../Interface/userInterface";
import isEmail from "validator/lib/isEmail";
import { authRole } from "../constant/userRole";

interface AllUsers extends Iuser, Document {
  clearCart(): Promise<void>;
  RemoveCart(productID: string): Promise<void>;
  addToCart(productID: string, quantity: number): Promise<boolean>;
}

const UserSchema = new Schema<AllUsers>(
  {
    Firstname: {
      type: String,
      required: [true, "Your Firstname is required"],
    },
    Lastname: {
      type: String,
      required: [true, "Your Lastname is required"],
    },
    Username: {
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
) {
  // Check if the product already exists in the cart
  const cartProductIndex = this.cart.items.findIndex(
    (item: { productId: { toString: () => string } }) =>
      item.productId.toString() === productId.toString()
  );

  if (cartProductIndex >= 0) {
    // If product exists, increase the quantity
    this.cart.items[cartProductIndex].quantity += quantity;
  } else {
    // If product does not exist, add a new entry
    this.cart.items.push({
      productId,
      quantity: quantity ? Number(quantity) : 1,
    });
  }

  // Save the updated cart
  return this.save({ validateBeforeSave: false });
};

UserSchema.methods.RemoveCart = function (productId: string) {
  const updateCart = this.cart.items.filter(
    (items: { productId: { toString: () => string } }) => {
      return items.productId.toString() !== productId.toString();
    }
  );
  this.cart.items = updateCart;
  return this.save({ validateBeforeSave: false });
};

UserSchema.methods.clearCart = function () {
  this.cart = { items: [] };
  return this.save();
};

export const User = model<AllUsers>("User", UserSchema);
