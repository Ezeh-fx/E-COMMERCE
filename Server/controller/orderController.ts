import { Request, Response, NextFunction } from "express";
import { AppError, HttpCode } from "../error/errorDefine";
import { Ioder } from "../Interface/orderInterface";
import { Order } from "../model/orderModel";
import { asyncHandler } from "../error/Async/asyncHandler";
import Stripe from "stripe";
import { envVaraibles } from "../env/environmentVar";
import { Product } from "../model/productModel";
import { getAddressDetails, getCordinate } from "../Utils/Tracker";
import axios from "axios";
import { User } from "../model/userModel";
import { Types } from "mongoose";
import webPush from "web-push";

const publicVapidKey = envVaraibles.PublicKey;
const privateVapidKey = envVaraibles.PrivateKey;

webPush.setVapidDetails(
  "mailto:your-email@example.com",
  publicVapidKey,
  privateVapidKey
);

let adminSubscriptions: any[] = [];

export const saveSubscription = async (req: Request, res: Response) => {
  const subscription = req.body;
  adminSubscriptions.push(subscription);
  return res.status(HttpCode.OK).json({ message: "Subscription saved" });
};

export const createOrderBeforePayment = asyncHandler(
  async (req: Request<any, {}, Ioder>, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;
      let totalAmount = 0;
      const { paymentMethod, orderItem, address, status } = req.body;

      if (!req.body || !Array.isArray(orderItem)) {
        return next(
          new AppError({
            message: "All fields are required",
            httpCode: HttpCode.FIELD_REQUIRED,
          })
        );
      }

      const existingUser = await User.findById(userId);
      if (!existingUser) {
        return next(
          new AppError({
            message: "User not found",
            httpCode: HttpCode.NOT_FOUND,
          })
        );
      }

      for (const item of orderItem) {
        const product = await Product.findById(item.productId);
        if (!product) {
          return res.status(404).json({
            success: false,
            message: `Product not found: ${item.productId}`,
          });
        }
        totalAmount += Number(product.price) * Number(item.quantity);
      }

      const latAndLong = await getCordinate(address);
      const addressDetails = await getAddressDetails(address);

      if (!latAndLong || !latAndLong.latitude || !latAndLong.longitude) {
        return next(
          new AppError({
            message: "Invalid address",
            httpCode: HttpCode.NOT_ACCEPTABLE,
          })
        );
      }

      const response = await axios.get(
        `https://timeapi.io/api/time/current/coordinate?latitude=${latAndLong.latitude}&longitude=${latAndLong.longitude}`,
        { headers: { Accept: "application/json" } }
      );

      if (!response.data) {
        return next(
          new AppError({
            message: "Invalid address",
            httpCode: HttpCode.BAD_REQUEST,
          })
        );
      }

      const timeZone = response.data.timeZone;

      const newOrder = await Order.create({
        user: new Types.ObjectId(userId),
        paymentMethod,
        orderItem,
        address,
        status,
        totalAmount,
        city: addressDetails.city,
        country: addressDetails.country,
        longitude: latAndLong.longitude,
        latitude: latAndLong.latitude,
        zipCode: addressDetails.postalCode
          ? parseInt(addressDetails.postalCode, 10)
          : null,
        timeZone,
      });

      const admins = await User.find({ role: "admin" });

      const notificationPayload = JSON.stringify({
        title: "New Order Received",
        body: `User ${newOrder.user} placed an order`,
      });

      adminSubscriptions.forEach((subscription) => {
        webPush
          .sendNotification(subscription, notificationPayload)
          .catch((err) => console.error(err));
      });

      return res.status(HttpCode.CREATE).json({
        message: "Order created successfully",
        data: {
          total: newOrder.totalAmount,
          items: newOrder.orderItem,
        },
      });
    } catch (error) {
      console.log(error);
      return next(
        new AppError({
          message: "Failed to create order",
          httpCode: HttpCode.INTERNAL_SERVER_ERROR,
        })
      );
    }
  }
);

const stripe = new Stripe(envVaraibles.STRIPE_SECRET_KEY);

export const PayForOrder = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { orderId } = req.params;
      const { token } = req.body;

      const order = await Order.findById(orderId);

      if (!order) {
        return next(
          new AppError({
            message: "Order not found",
            httpCode: HttpCode.NOT_FOUND,
          })
        );
      }

      const charge = await stripe.charges.create({
        amount: order.totalAmount * 100,
        currency: "usd",
        source: token,
        description: `Order payment for ${orderId}`,
      });

      order.status = "paid";
      await order.save();

      return res.status(HttpCode.OK).json({
        message: "Payment successful",
        data: order,
      });
    } catch (error) {
      console.log(error);
      return next(
        new AppError({
          message: "Failed to create order",
          httpCode: HttpCode.INTERNAL_SERVER_ERROR,
        })
      );
    }
  }
);

export const getOrders = asyncHandler(
  async (
    req: Request<{}, {}, Ioder>,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const orders = await Order.find().populate("user", "name email");

      if (!orders) {
        return next(
          new AppError({
            message: "Order not found",
            httpCode: HttpCode.NOT_FOUND,
          })
        );
      }

      return res.status(HttpCode.OK).json({
        message: "Orders fetched successfully",
        data: orders,
      });
    } catch (error) {
      console.log(error);
      return next(
        new AppError({
          message: "An error occurred while fetching orders",
          httpCode: HttpCode.INTERNAL_SERVER_ERROR,
        })
      );
    }
  }
);

export const getOrder = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const order = await Order.findById(req.params.id).populate(
        "user",
        "name email"
      );
      if (!order) {
        return res.status(HttpCode.NOT_FOUND).json({
          message: "Order not found",
        });
      }
      return res.status(HttpCode.OK).json({
        message: "Order fetched successfully",
        data: order,
      });
    } catch (error) {
      console.log(error);
      return next(
        new AppError({
          message: "An error occurred while fetching order",
          httpCode: HttpCode.INTERNAL_SERVER_ERROR,
        })
      );
    }
  }
);
9;

export const updateOrderToDelivered = asyncHandler(
  async (
    req: Request<any, {}, Ioder>,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const order = await Order.findById(req.params.id);

      if (!order) {
        return res.status(HttpCode.NOT_FOUND).json({
          message: "Order not found",
        });
      }

      order.status = "delivered";
      await order.save();

      return res.status(HttpCode.OK).json({
        message: "Order updated successfully",
        data: order,
      });
    } catch (error) {
      console.log(error);
      return next(
        new AppError({
          message: "An error occurred while updating order",
          httpCode: HttpCode.INTERNAL_SERVER_ERROR,
        })
      );
    }
  }
);

export const getMyOrders = asyncHandler(
  async (
    req: Request<any, {}, Ioder>,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const { user } = req.params;

      const orders = await Order.find({ user: user });

      if (orders.length === 0) {
        // Check if array is empty
        return res.status(HttpCode.NOT_FOUND).json({
          message: "No order found for this user",
          data: [],
        });
      }
      return res.status(HttpCode.OK).json({
        message: "Orders fetched successfully",
        data: orders,
      });
    } catch (error) {
      console.log(error);
      return next(
        new AppError({
          message: "An error occurred while fetching orders",
          httpCode: HttpCode.INTERNAL_SERVER_ERROR,
        })
      );
    }
  }
);

export const DeleteOrder = asyncHandler(
  async (
    req: Request, 
    res: Response, 
    next: NextFunction
  ): Promise<any> => {
    try {
      const { orderId } = req.params;

      const order = await Order.findByIdAndDelete(orderId);

      if (!order) {
        return next(
          new AppError({
            message: "Order not found",
            httpCode: HttpCode.NOT_FOUND,
          })
        );
      }

      order.status = "cancelled";
      await order.save();
      return res.status(HttpCode.OK).json({
        message: "Order updated successfully",
      });
    } catch (error) {
      console.log(error);
      return next(
        new AppError({
          message: "An error occurred while deleting orders",
          httpCode: HttpCode.INTERNAL_SERVER_ERROR,
        })
      );
    }
  }
);
