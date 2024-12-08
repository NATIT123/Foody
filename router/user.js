import { Router } from "express";
const router = Router();
import {
  addUser,
  updateUserById,
  deleteUserById,
  getAllUsers,
  getUserById,
} from "../controllers/userController.js";

router.get("/getAllUsers", getAllUsers);
router.post("/addUser", addUser);
router.delete("/deleteUser/:id", deleteUserById);
router.patch("/updateUser/:id", updateUserById);
router.get("/getUser/:id", getUserById);

export default router;
