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
} from "../controllers/commentController.js";
router.get("/count", countComments);
router.get("/getAllComment", getAllComments);
router.post("/addComment/user/:userId/restaurant/:restaurantId", addComment);
router.delete("/deleteComment/:id", deleteCommentById);
router.patch("/updateComment/:id", updateCommentById);
router.get("/getComment/:id", getCommentById);
router.get("/getCommentsByRestaurant/:restaurantId", getCommentsByRestaurant);

export default router;
