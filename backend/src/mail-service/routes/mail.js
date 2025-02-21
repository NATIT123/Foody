import express from "express";
import {
  sendWelcomeEmail,
  sendPasswordResetEmail,
} from "../controllers/mailController.js";

const router = express.Router();

router.post("/sendWelcome", sendWelcomeEmail);
router.post("/sendPasswordReset", sendPasswordResetEmail);

module.exports = router;
