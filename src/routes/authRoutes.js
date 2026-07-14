import express from "express";
import {
  registerController,
  verifyCodeController,
  resendCodeController,
  loginController,
} from "../controller/authController.js";

const authRoutes = express.Router();

authRoutes.post("/register", registerController);
authRoutes.post("/verify-code", verifyCodeController);
authRoutes.post("/resend-code", resendCodeController);
authRoutes.post("/login", loginController);

export default authRoutes;