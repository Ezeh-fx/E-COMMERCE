import { Request, Response, NextFunction } from "express";
import { Iuser } from "../Interface/userInterface";
import { asyncHandler } from "../error/Async/asyncHandler";
import { AppError, HttpCode } from "../error/errorDefine";
import { User } from "../model/userModel";
import bcrypt from "bcrypt";
import { randomBytes } from "crypto";
import { addMinutes, isAfter } from "date-fns";
import { SendOtpCode, ForgetPasswordEmail } from "../Utils/nodemailer";
import cloudinary from "../Utils/Cloudinary";
import streamifier from "streamifier";
import {
  generateRefreshToken,
  generateToken,
  jwtSecret,
  REFRESHSecret,
} from "../middleware/Authentication/userAuthentication";
import jwt from "jsonwebtoken";

function generateNumericOTP(): string {
  const randomBuffer = randomBytes(2);
  const randomNumber = (randomBuffer.readUInt16BE(0) % 9000) + 1000;
  return randomNumber.toString();
}

export const CreateUser = asyncHandler(
  async (
    req: Request<{}, {}, Iuser>,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const {
        firstname,
        lastname,
        username,
        email,
        password,
      } = req.body;

      console.log(req.body);

      if (!firstname || !lastname || !username || !email || !password) {
        return next(
          new AppError({
            message: "All required fields are required",
            httpCode: HttpCode.FIELD_REQUIRED,
          })
        );
      }

      const CheckIfExists = await User.findOne({
        email: email,
      });

      if (CheckIfExists) {
        return next(
          new AppError({
            message: "User already exists",
            httpCode: HttpCode.CONFLICT,
          })
        );
      } else {
        const slt = await bcrypt.genSalt(10);
        const Hash = await bcrypt.hash(password, slt);
        const OTP = generateNumericOTP();
        const otpExpiryTimestamp = addMinutes(new Date(), 5);

        const create = await User.create({
          firstname,
          lastname,
          username,
          email,
          password: Hash,
          OtpCode: OTP,
          confirmPassword: Hash,
          OTPExpiry: otpExpiryTimestamp,
        });

        SendOtpCode(create).then(() => {
          console.log(`message been sent to you: ${create.email}`);
        });

        if (!create) {
          return next(
            new AppError({
              message: "Unable to register user",
              httpCode: HttpCode.BAD_REQUEST,
            })
          );
        }

        return res.status(HttpCode.CREATE).json({
          message: "registration successful",
          data: {
            id: create.id,
            firstname: create.firstname,
          },
        });
      }
    } catch (error: any) {
      console.log(error.message);
      return next(error);
    }
  }
);

export const VerifyAccount = asyncHandler(
  async (
    req: Request<{}, {}, Iuser>,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const { email, OtpCode } = req.body;

      if (!email || !OtpCode) {
        return next(
          new AppError({
            message: "All required fields are required",
            httpCode: HttpCode.FIELD_REQUIRED,
          })
        );
      }

      const user = await User.findOne({ email: email });
      if (!user) {
        return next(
          new AppError({
            message: "User does not exist",
            httpCode: HttpCode.NOT_FOUND,
          })
        );
      }

      const currentTime = new Date();
      const userOTPExpiry = user.OTPExpiry;
      if (userOTPExpiry === undefined) {
        return next(
          new AppError({
            message: "OTPExpiry is not defined....SIGN UP",
            httpCode: HttpCode.BAD_REQUEST,
          })
        );
      }

      if (isAfter(currentTime, userOTPExpiry)) {
        return next(
          new AppError({
            message: "OTP has expired",
            httpCode: HttpCode.BAD_REQUEST,
          })
        );
      }

      if (user.OtpCode !== OtpCode) {
        return next(
          new AppError({
            message: "Invalid OTP",
            httpCode: HttpCode.BAD_REQUEST,
          })
        );
      }

      await User.findByIdAndUpdate(
        user.id,
        {
          verify: true,
          OtpCode: null,
          OTPExpiry: null,
        },
        { new: true }
      );

      return res.status(HttpCode.OK).json({
        message: "Account has been verified , Proceed to Login",
      });
    } catch (error: any) {
      console.log(error.message);
      return next(error);
    }
  }
);

export const LoginUser = asyncHandler(
  async (
    req: Request<{}, {}, Iuser>,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const { email, password } = req.body;

      const FindUser = await User.findOne({ email: email });

      if (!FindUser) {
        return next(
          new AppError({
            message: "User does not exist",
            httpCode: HttpCode.NOT_FOUND,
          })
        );
      }

      const CheckPassword = await bcrypt.compare(password, FindUser.password);

      if (!CheckPassword) {
        return next(
          new AppError({
            message: "Invalid Password",
            httpCode: HttpCode.BAD_REQUEST,
          })
        );
      }

      if (FindUser.verify === false || FindUser.OtpCode !== null) {
        return next(
          new AppError({
            message: "Account not verified",
            httpCode: HttpCode.BAD_REQUEST,
          })
        );
      }

      const Token = generateToken({ _id: FindUser._id, email: FindUser.email, role: FindUser.role,});
      const Refresh = generateRefreshToken({
        _id: FindUser._id,
        email: FindUser.email,
        role: FindUser.role,
      });

      return res.status(HttpCode.OK).json({
        message: "Login successful",
        data: {
          id: FindUser.id,
          name: FindUser.name,
          email: FindUser.email,
          token: Token,
          refresh: Refresh,
        },
      });
    } catch (error) {
      console.error(error);
      return next(error);
    }
  }
);

const uploadImageWithRetries = async (image: any, retries = 3) => {
  let attempts = 0;
  while (attempts < retries) {
    try {
      const uploadResponse: any = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { timeout: 10000 },
          (error: any, result: any) => {
            if (error) {
              console.error("Cloudinary upload error:", error);
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
        streamifier.createReadStream(image.buffer).pipe(stream);
      });
      return uploadResponse.secure_url;
    } catch (error) {
      attempts++;
      console.warn(`Upload attempt ${attempts} failed:`, error);
      if (attempts >= retries)
        throw new Error("Cloudinary upload failed after multiple attempts.");
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds before retrying
    }
  }
  return null;
};

export const ChangeUserProfileImage = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { userId } = req.params;
      const image = req.file;

      if (!userId) {
        return next(
          new AppError({
            message: "ID required",
            httpCode: HttpCode.FIELD_REQUIRED,
          })
        );
      }

      if (!image) {
        return next(
          new AppError({
            message: "Image not found",
            httpCode: HttpCode.NOT_FOUND,
          })
        );
      }

      const user = await User.findById(userId);
      if (!user) {
        return next(
          new AppError({
            message: "User not found",
            httpCode: HttpCode.NOT_FOUND,
          })
        );
      }

      let uploadedImageUrl: string | null = null;
      try {
        uploadedImageUrl = await uploadImageWithRetries(image);
        if (!uploadedImageUrl) {
          return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({
            message: "Cloudinary upload failed after multiple attempts",
          });
        }
      } catch (error: any) {
        return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({
          message:
            error.message || "Cloudinary upload failed after multiple attempts",
        });
      }

      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        { profileImage: uploadedImageUrl }, // Ensure this field matches your schema
        { new: true }
      );

      if (!updatedUser) {
        return next(
          new AppError({
            message: "Error changing image",
            httpCode: HttpCode.CONFLICT,
          })
        );
      }

      return res.status(HttpCode.OK).json({
        message: "Image change successfully completed",
        data: updatedUser,
      });
    } catch (error) {
      console.error(error);
      return next(error);
    }
  }
);

export const ResendOtp = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { email } = req.body;
      if (!email) {
        return next(
          new AppError({
            message: "email required",
            httpCode: HttpCode.FIELD_REQUIRED,
          })
        );
      }

      const FindUser = await User.findOne({ email: email });

      if (!FindUser) {
        return next(
          new AppError({
            message: "User not found",
            httpCode: HttpCode.NOT_FOUND,
          })
        );
      }

      const otpExpiryTimestamp = addMinutes(new Date(), 5);

      const OTP = generateNumericOTP();

      FindUser.OtpCode = Number(OTP);
      FindUser.OTPExpiry = otpExpiryTimestamp.toString();
      FindUser.save();
      SendOtpCode(FindUser).then(() => {
        console.log(`message been sent to you: ${FindUser?.email}`);
      });

      if (!FindUser) {
        return next(
          new AppError({
            message: "Unable to resend OTP",
            httpCode: HttpCode.BAD_REQUEST,
          })
        );
      }

      return res.status(HttpCode.OK).json({
        message: "OTP has been resent",
        data: FindUser,
      });
    } catch (error) {
      console.error(error);
      return next(error);
    }
  }
);

export const UpdateUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { userId } = req.params;
      const { password, profileImages, ...updateData } = req.body; // Exclude password and profileImages from update

      if (!userId) {
        return next(
          new AppError({
            message: "ID is required",
            httpCode: HttpCode.FIELD_REQUIRED,
          })
        );
      } else {
        if (password || profileImages) {
          return next(
            new AppError({
              message:
                "Password and profile Image can not be updated through this route",
              httpCode: HttpCode.BAD_REQUEST,
            })
          );
        }
      }

      const updateProfile = await User.findByIdAndUpdate(
        { _id: userId },
        {
          $set: updateData,
        },
        { new: true }
      );

      if (!updateProfile) {
        return next(
          new AppError({
            message: "User Update failed",
            httpCode: HttpCode.CONFLICT,
          })
        );
      }
      return res.status(HttpCode.OK).json({
        message: "User Update Successfully",
        data: {
          item: updateData,
        },
      });
    } catch (error) {
      console.error(error);
      return next(error);
    }
  }
);

export const getAllUser = asyncHandler(
  async (
    req: Request<{}, {}, Iuser>,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const users = await User.find().select("-password");

      return res.status(HttpCode.OK).json({
        length: users.length,
        message: users.length ? "All users" : "No users available",
        data: users.length ? users : null,
      });
    } catch (error) {
      console.error(error);
      return next(error);
    }
  }
);

export const getOneUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const userId = req.params?.userId;

      if (!userId) {
        return next(
          new AppError({
            message: "ID is required",
            httpCode: HttpCode.FIELD_REQUIRED,
          })
        );
      }

      const user = await User.findById(userId).select("-password");

      if (!user) {
        return next(
          new AppError({
            message: "User not found",
            httpCode: HttpCode.FIELD_REQUIRED,
          })
        );
      }

      return res.status(HttpCode.OK).json({
        message: "User Found Successfully",
        data: user,
      });
    } catch (error) {
      console.error(error);
      return next(error);
    }
  }
);

export const DeleteUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { userId } = req.params;

      if (!userId) {
        return next(
          new AppError({
            message: "ID is required",
            httpCode: HttpCode.FIELD_REQUIRED,
          })
        );
      }

      const delete_user = await User.findByIdAndDelete(userId);

      if (!delete_user) {
        return next(
          new AppError({
            message: "User not found",
            httpCode: HttpCode.FIELD_REQUIRED,
          })
        );
      }

      return res.status(HttpCode.OK).json({
        message: "User deleted successfully",
        data: delete_user,
      });
    } catch (error) {
      console.error(error);
      return next(error);
    }
  }
);

export const refreshToken = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      // Extract the refresh token from the request body or headers
      const refreshToken =
        req.body.refreshToken || req.headers["refresh-token"];

      if (!refreshToken) {
        return next(
          new AppError({
            message: "refreshToken is required",
            httpCode: HttpCode.FIELD_REQUIRED,
          })
        );
      }

      // Verify the refresh token
      jwt.verify(refreshToken, REFRESHSecret, (err: any, user: any) => {
        if (err) {
          return res.status(403).json({
            message: err?.message,
          });
        }

        // If the refresh token is valid, generate a new access token
        const newAccessToken = jwt.sign(
          { _id: user._id, email: user.email },
          jwtSecret,
          {
            expiresIn: "15m",
          }
        );

        // Generate a new refresh token (optional, depending on your implementation)
        const newRefreshToken = generateRefreshToken({
          _id: user._id,
          email: user.email,
          role: user.role,
        });

        // Respond with the new access token and optionally the new refresh token
        return res.status(HttpCode.OK).json({
          message: "Token refreshed successfully",
          data: {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
          },
        });
      });
    } catch (error) {
      console.error(error);
      return next(error);
    }
  }
);

export const ForgetPassword = asyncHandler(
  async (req: Request<{}, {}, Iuser>, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;

      if (!email) {
        return next(
          new AppError({
            message: "email required",
            httpCode: HttpCode.FIELD_REQUIRED,
          })
        );
      }
      const user = await User.findOne({ email: email });

      if (!user) {
        return next(
          new AppError({
            message: "User not found",
            httpCode: HttpCode.FIELD_REQUIRED,
          })
        );
      }
      // Generate 4-digit OTP
      const OTP = generateNumericOTP();

      // Update OTP in user record
      const update = await User.findByIdAndUpdate(
        user._id,
        { OtpCode: OTP },
        { new: true }
      );

      // Send OTP email
      await ForgetPasswordEmail(update);
      console.log(`OTP sent to ${update?.email}`);

      return res.status(HttpCode.OK).json({
        message: "An OTP has been sent to your email",
      });
    } catch (error) {
      console.error(error);
      return next(error);
    }
  }
);

export const UpdatePassword = asyncHandler(
  async (req: Request<{}, {}, Iuser>, res: Response, next: NextFunction) => {
    try {
      const { OtpCode, password } = req.body;

      if (!password) {
        return next(
          new AppError({
            message: "password required",
            httpCode: HttpCode.FIELD_REQUIRED,
          })
        );
      }

      // Find user by OTP
      const checkingOTP = await User.findOne({ OtpCode });

      if (!checkingOTP || checkingOTP.OtpCode !== OtpCode) {
        return next(
          new AppError({
            message: "Wrong OTP",
            httpCode: HttpCode.NOT_ACCEPTABLE,
          })
        );
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Update password and clear OTP
      const changepassword = await User.findByIdAndUpdate(
        checkingOTP._id, // ✅ Corrected ID reference
        {
          password: hashedPassword,
          OtpCode: null,
        },
        { new: true }
      );

      if (!changepassword) {
        return next(
          new AppError({
            message: "update failed",
            httpCode: HttpCode.BAD_REQUEST,
          })
        );
      }

      return res.status(HttpCode.OK).json({
        message: "Password Changed",
        data: changepassword,
      });
    } catch (error) {
      console.error(error);
      return next(error);
    }
  }
);

export const updateToadmn = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;

      // ✅ Check if an admin already exists in the database
      const existingAdmin = await User.findOne({ role: "admin" });

      if (existingAdmin) {
        // ✅ If an admin exists, only an admin can promote others
        if (req.body.userData.role !== "admin") {
          return next(
            new AppError({
              message: "Only an admin can update another user to admin",
              httpCode: HttpCode.UNAUTHORIZED,
            })
          );
        }
      }

      // ✅ If no admin exists, the first user to call this API becomes an admin
      const userToUpdate = await User.findById(userId);
      if (!userToUpdate) {
        return next(
          new AppError({
            message: "User not found",
            httpCode: HttpCode.NOT_FOUND,
          })
        );
      }

      if (userToUpdate.role === "admin") {
        return next(
          new AppError({
            message: "User is already an admin",
            httpCode: HttpCode.BAD_REQUEST,
          })
        );
      }

      userToUpdate.role = "admin";
      await userToUpdate.save();

      return res.status(HttpCode.OK).json({
        message: "User has been updated to admin successfully",
        user: userToUpdate,
      });
    } catch (error) {
      console.log(error);
      return next(
        new AppError({
          message: "An error occurred while updating the user to admin",
          httpCode: HttpCode.INTERNAL_SERVER_ERROR,
        })
      );
    }
  }
);

export const addToCart = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId, productId, quantity } = req.body;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(HttpCode.NOT_FOUND).json({ error: "User not found" });
      }

      await user.addToCart(productId, quantity || 1);
      return res.json({
        message: "Item added to cart successfully!",
        cart: user.cart,
      });
    } catch (error) {
      console.error(error);
      return res
        .status(HttpCode.INTERNAL_SERVER_ERROR)
        .json({ error: "Server error" });
    }
  }
);

export const removeFromCart = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId, productId } = req.body;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      await user.RemoveCart(productId);
      return res.json({
        message: "Item removed from cart successfully!",
        cart: user.cart,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Server error" });
    }
  }
);

export const EmptyCart = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.body;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      await user.clearCart();
      return res.json({
        message: "Cart emptied successfully!",
        cart: user.cart,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Server error" });
    }
  }
);
