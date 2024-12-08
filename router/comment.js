import { Router } from "express";
const router = Router();
import {
  addComment,
  getAllComments,
  deleteCommentById,
  updateCommentById,
  getCommentById,
} from "../controllers/commentController.js";

router.get("/getAllComment", getAllComments);
router.post("/addComment", addComment);
router.delete("/deleteComment/:id", deleteCommentById);
router.patch("/updateComment/:id", updateCommentById);
router.get("/getComment/:id", getCommentById);

export default router;
