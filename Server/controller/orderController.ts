import { NextFunction, Request, Response } from "express";
import Stripe from "stripe";
import { Order } from "../model/orderModel";
import { Product } from "../model/productModel";
import webpush, { adminSubscription } from "../Utils/webPush";
import { envVaraibles } from "../env/environmentVar";
import { User } from "../model/userModel";
import { AppError, HttpCode } from "../error/errorDefine";

const stripe = new Stripe(envVaraibles.STRIPE_SECRET_KEY, {
  apiVersion: "2025-02-24.acacia",
});

export const createCheckoutSession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return next(
        new AppError({
          message: "User not found",
          httpCode: HttpCode.NOT_FOUND,
        })
      );
    }

    const cartItems = user.cart;
    if (!cartItems || !cartItems.items || cartItems.items.length === 0) {
      return next(
        new AppError({
          message: "Cart is empty",
          httpCode: HttpCode.BAD_REQUEST,
        })
      );
    }

    // 🔁 Fetch product details for each cart item
    const lineItems = await Promise.all(
      cartItems.items.map(async (item: any) => {
        const product = await Product.findById(item.productId);
        if (!product) {
          throw new Error(`Product not found: ${item.productId}`);
        }

        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: product.name,
              // Optional: add description or images here
            },
            unit_amount: Math.round(product.price * 100),
          },
          quantity: item.quantity,
        };
      })
    );

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      shipping_address_collection: {
        allowed_countries: ["US", "IN", "CA", "NG"],
      },
      phone_number_collection: { enabled: true },
      line_items: lineItems,
      mode: "payment",
      customer_email: user.email,
      metadata: {
        userId,
      },
      success_url:
        "http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:5173/cancel",
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe session error:", err);
    res
      .status(HttpCode.INTERNAL_SERVER_ERROR)
      .json({ error: "Checkout session creation failed" });
  }
};

export const handleStripeWebhook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const sig = req.headers["stripe-signature"]!;
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err) {
    console.error("Webhook Error:", err);
    return res.status(HttpCode.BAD_REQUEST).send(`Webhook Error: ${err}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ["line_items", "customer_details"],
      });

      const userId = session.metadata?.userId;
      const user = await User.findById(userId);
      if (!user) return res.status(HttpCode.NOT_FOUND).send("User not found");

      const order = new Order({
        user: userId,
        email: user.email,
        name: user.firstname,
        address: fullSession.customer_details?.address,
        items: user.cart,
        total: fullSession.amount_total! / 100,
        status: "paid",
      });

      await order.save();

      const payload = JSON.stringify({
        title: "🛒 New Order",
        body: `User ${user.name} placed an order for $${order.total}`,
      });

      await webpush.sendNotification(adminSubscription, payload);
      console.log("📣 Admin notified");
    } catch (err) {
      console.error("Order creation error:", err);
      return next(
        new AppError({
          message: "Failed to create order",
          httpCode: HttpCode.INTERNAL_SERVER_ERROR,
        })
      );
    }
  }

  res.status(HttpCode.OK).send("Webhook received");
};

export const getAllOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Find all orders for the logged-in user, populate user name and email
    const orders = await Order.find({ user: userId }).populate(
      "user",
      "name email"
    );

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

export const getOneOrder = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch order" });
  }
};
