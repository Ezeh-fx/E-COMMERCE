import express, { Router } from "express";
import { authenticate_token } from "../middleware/Authentication/userAuthentication";
import { isAdmin } from "../middleware/Authentication/adminAuth";
import {
  createCheckoutSession,
  getAllOrders,
  handleStripeWebhook,
} from "../controller/orderController";

const OrderRoute = Router();

OrderRoute.route("/create-checkout-session").post(
  authenticate_token,
  createCheckoutSession
);
OrderRoute.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  (req, res, next) => {
    Promise.resolve(handleStripeWebhook(req, res, next)).catch(next);
  }
);
OrderRoute.get("/orders/:userId", authenticate_token, (req, res, next) => {
  Promise.resolve(getAllOrders(req, res, next)).catch(next);
});
export default OrderRoute;
