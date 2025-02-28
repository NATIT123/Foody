import { Router } from "express";
const router = Router();
import {
  addComment,
  getAllComments,
  deleteCommentById,
  updateCommentById,
  getCommentById,
  getCommentsByRestaurant,
  countComments,
  handleLike,
  replyComment,
} from "../controllers/commentController.js";

import { protect } from "../controllers/authController.js";

router.get("/count", countComments);
router.get("/getAllComment", getAllComments);
router.post("/addComment/user/:userId/restaurant/:restaurantId", addComment);
router.delete("/deleteComment/:id", deleteCommentById);
router.patch("/updateComment/:id", updateCommentById);
router.get("/getComment/:id", getCommentById);
router.get("/getCommentsByRestaurant/:restaurantId", getCommentsByRestaurant);

router.get("/like/:commentId/:userId", protect, handleLike);

router.post("/reply/:commentId", protect, replyComment);

export default router;
