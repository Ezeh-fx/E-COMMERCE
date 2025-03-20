import passport from "passport";
import express, { Request, Response } from "express";
import "../controller/goggleAuth/goggleAuth";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Route to initiate Google login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth callback route
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req: Request, res: Response) => {
    if (!req.user) {
      return res.redirect(`${process.env.CLIENT_URL}/login?error=true`);
    }

    // Generate JWT token
    const token = jwt.sign({ user: req.user }, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });

    // Redirect user back to frontend with token
    res.redirect(`${process.env.CLIENT_URL}/product?token=${token}`);
  }
);

export default router;
