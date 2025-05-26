// auth.js
import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = Router();

router.get(
  "/auth",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = jwt.sign(
      {
        id: req.user._id,
        name: req.user.displayName,
        email: req.user.email,
        photo: req.user.photo,
      },
      process.env.JWT_SECERT || "secret",
      { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
    );
    res.redirect(`http://localhost:3001/login-success?token=${token}`);
  }
);

export default router;
