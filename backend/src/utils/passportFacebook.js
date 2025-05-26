import passport from "passport";
import { Strategy as FacebookStrategy } from "passport-facebook";
import User from "../models/userModel.js";

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_APP_CLIENT_SECRET,
      callbackURL:
        process.env.FACEBOOK_APP_CALLBACK_URL ||
        "http://localhost:3000/api/v1/facebook/callback",
      profileFields: ["id", "displayName", "emails", "photos"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        const photo = profile.photos?.[0]?.value;

        if (!email) {
          return done(new Error("Email not provided by Facebook"), null);
        }

        let existingUser = await User.findOne({ email });

        if (existingUser) {
          if (!existingUser.facebookId) {
            existingUser.facebookId = profile.id;
            existingUser.photo = photo || existingUser.photo;
            await existingUser.save({ validateBeforeSave: false });
          }

          return done(null, existingUser);
        }

        const newUser = await User.create({
          facebookId: profile.id,
          fullname: profile.displayName || "Facebook User",
          type: "facebook",
          email: email,
          photo: photo || "",
          address: "N/A",
          password: "facebook_default_password",
          confirmPassword: "facebook_default_password",
        });

        return done(null, newUser);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

export default passport;
