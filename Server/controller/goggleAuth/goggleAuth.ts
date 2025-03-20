import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import passport from "passport";
import { User } from "../../model/userModel";

dotenv.config();

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID as string,
      clientSecret: process.env.CLIENT_SECRET as string,
      callbackURL: "http://localhost:2343/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      // Check if user already exists in DB
      const user = await User.findOne({ email: profile.emails![0].value });

      // If user already exists, return user
      if (user) {
        return done(null, user);
      } else {
        const userCreated = await User.create({
          email: profile._json.email,
          userName: profile.name ? profile.name.familyName : "",
          token: "",
          verified: profile._json.email_verified,
        });
        return done(null, userCreated);
      }
    }
  )
);

// Serialize & Deserialize user
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj as Express.User);
});
