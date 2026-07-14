import { register, verifyCode, resendCode, login } from "../service/authService.js";

export const registerController = async (req, res) => {
  try {
    const result = await register(req.body);
    res.status(200).json({ success: true, message: "User registered successfully", ...result });
  } catch (error) {
    console.error("❌ register error:", error);
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

export const verifyCodeController = async (req, res) => {
  try {
    const result = await verifyCode(req.body);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    console.error("❌ verify-code error:", error);
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

export const resendCodeController = async (req, res) => {
  try {
    const result = await resendCode(req.body);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    console.error("❌ resend-code error:", error);
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

export const loginController = async (req, res) => {
  try {
    const result = await login(req.body);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    console.error("❌ login error:", error);
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};