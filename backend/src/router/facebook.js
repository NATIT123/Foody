import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = express.Router();

router.get("/auth", passport.authenticate("facebook", { scope: ["email"] }));

router.get(
  "/callback",
  passport.authenticate("facebook", { session: false }),
  (req, res) => {
    const token = jwt.sign(
      {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
      },
      process.env.JWT_SECERT,
      { expiresIn: "1h" }
    );

    res.redirect(`http://localhost:3001/login-success?token=${token}`);
  }
);

export default router;
