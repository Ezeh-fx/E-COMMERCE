import { Router } from "express";
import {
  loginValidation,
  registerValidation,
} from "../middleware/validation/AuthValidator/userValidation";
import {
  addToCart,
  ChangeUserProfileImage,
  CreateUser,
  DeleteUser,
  EmptyCart,
  ForgetPassword,
  getAllUser,
  getOneUser,
  LoginUser,
  removeFromCart,
  ResendOtp,
  UpdatePassword,
  updateToadmn,
  VerifyAccount,
} from "../controller/userController";
import multer from "multer";
import { authenticate_token } from "../middleware/Authentication/userAuthentication";
import { isAdmin } from "../middleware/Authentication/adminAuth";
const storage = multer.memoryStorage(); // Store in memory for Cloudinary
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file limit
});

const UserRoute = Router();

UserRoute.route("/register").post(registerValidation, CreateUser);
UserRoute.route("/verify").post(VerifyAccount);
UserRoute.route("/Login").post(loginValidation, LoginUser);
UserRoute.route("/changeProfileImage/:userId").patch(
  upload.single("profileImage"),
  ChangeUserProfileImage
);
UserRoute.route("/resendotp").get(ResendOtp);
UserRoute.route("/getAll").get(authenticate_token, isAdmin, getAllUser);
UserRoute.route("/getOne/:userId").get(authenticate_token, isAdmin, getOneUser);
UserRoute.route("/delete/:userId").delete(authenticate_token, isAdmin, DeleteUser);
UserRoute.patch("/update-to-admin/:userId", authenticate_token, updateToadmn);
UserRoute.post("/add", addToCart);
UserRoute.post("/remove", removeFromCart);
UserRoute.post("/empty", EmptyCart);
UserRoute.post("/forgot-password", ForgetPassword);
UserRoute.post("/reset-password", UpdatePassword);

export default UserRoute;
