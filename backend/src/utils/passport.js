import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/userModel.js";
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_APP_CLIENT_ID,
      clientSecret: process.env.GOOGLE_APP_CLIENT_SECRET,
      callbackURL:
        process.env.GOOGLE_APP_CALLBACK_URL ||
        "http://localhost:3000/api/v1/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;

        let existingUser = await User.findOne({ email });

        if (existingUser) {
          if (!existingUser.googleId) {
            existingUser.googleId = profile.id;
            await existingUser.save({ validateBeforeSave: false });
            return done(null, existingUser);
          }

          return done(null, existingUser);
        }

        const newUser = await User.create({
          googleId: profile.id,
          type: "google",
          fullname: profile.displayName,
          email: profile.emails[0].value,
          photo: profile.photos[0].value,
          address: "default address",
          confirmPassword: "default password",
          password: "default password",
        });

        return done(null, newUser);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

export default passport;
