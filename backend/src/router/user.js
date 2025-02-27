import { Router } from "express";
const router = Router();
import {
  addUser,
  updateUserById,
  deleteUserById,
  getAllUsers,
  getUserById,
  uploadPhoto,
  getUserDetails,
  getAllDetails,
  findUsersByFields,
  getChatBotResponse,
  findUsersByRole,
  countUsers,
} from "../controllers/userController.js";

import {
  signUp,
  logIn,
  forgotPassword,
  changePassword,
  protect,
  resetPassword,
  restrictTo,
  logOut,
  getMe,
  updateMe,
  deleteMe,
  refreshToken,
  checkPassword,
} from "../controllers/authController.js";
import AppError from "../utils/appError.js";
import multer from "multer";
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});
router.post("/signUp", signUp);
router.post("/login", logIn);

router.post("/forgotPassword", forgotPassword);
router.post("/checkPassword/:token", checkPassword);
router.patch("/resetPassword/:token", resetPassword);
router.get("/getUserDetails/:userId", getUserDetails);
router.get("/getAllDetails", getAllDetails);
router.get("/findUsersByFields", findUsersByFields);
router.get("/findUsersByRole", findUsersByRole);
router.get("/count", countUsers);

// ///Protect all route
router.use(protect);
router.patch("/updatePassword", getMe, changePassword);
router.get("/me", getMe, getUserById);

router.post("/uploadPhoto", upload.single("image"), getMe, uploadPhoto);

router.patch("/updateMe", getMe, updateMe);

router.delete("/deleteMe", getMe, deleteMe);

router.post("/logOut", getMe, logOut);

router.post("/refresh", refreshToken);

// router.use(restrictTo("admin"));

router.get("/getAllUsers", getAllUsers);
router.post("/addUser", addUser);
router.delete("/deleteUser/:id", deleteUserById);
router.patch("/updateUser/:id", updateUserById);
router.get("/getUser/:id", getUserById);
router.get("/getChatResponse", getChatBotResponse);

export default router;
