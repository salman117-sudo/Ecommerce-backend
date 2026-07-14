import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import env from "#env";
import {
  findUserByEmail,
  findUserById,
  createUser,
  updateVerificationCode,
  markUserVerified,
} from "../repository/userRepository.js";
import { sendVerificationEmail } from "../utils/mailer.js";

const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();

export const register = async ({ email, password, name }) => {
  if (!email || !password || !name) {
    const error = new Error("All fields are required");
    error.statusCode = 400;
    throw error;
  }

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    const error = new Error("User already exists, please login");
    error.statusCode = 400;
    throw error;
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);
  const verificationCode = generateCode();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  const user = await createUser({
    email,
    password: hashedPassword,
    name,
    verificationCode,
    verificationCodeExpiresAt: expiresAt,
  });

  await sendVerificationEmail(email, verificationCode);

  return { userId: user._id, email: user.email };
};

export const verifyCode = async ({ userId, code }) => {
  const user = await findUserById(userId);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  if (user.isVerified) {
    const error = new Error("User already verified");
    error.statusCode = 400;
    throw error;
  }

  if (!user.verificationCode || user.verificationCode !== code) {
    const error = new Error("Invalid verification code");
    error.statusCode = 400;
    throw error;
  }

  if (new Date() > user.verificationCodeExpiresAt) {
    const error = new Error("Verification code has expired");
    error.statusCode = 400;
    throw error;
  }

  await markUserVerified(user._id);

  const token = jwt.sign({ userId: user._id }, env.JWT_SECRET, { expiresIn: "7d" });

  return {
    token,
    user: { id: user._id, name: user.name, email: user.email },
  };
};

export const resendCode = async ({ userId }) => {
  const user = await findUserById(userId);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  if (user.isVerified) {
    const error = new Error("User already verified");
    error.statusCode = 400;
    throw error;
  }

  const verificationCode = generateCode();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await updateVerificationCode(user._id, verificationCode, expiresAt);
  await sendVerificationEmail(user.email, verificationCode);

  return { message: "Verification code resent" };
};

export const login = async ({ email, password }) => {
  const user = await findUserByEmail(email);

  if (!user) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  if (!user.isVerified) {
    const error = new Error("Please verify your email first");
    error.statusCode = 403;
    throw error;
  }

  const isMatch = bcryptjs.compareSync(password, user.password);
  if (!isMatch) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const token = jwt.sign({ userId: user._id }, env.JWT_SECRET, { expiresIn: "7d" });

  return {
    token,
    user: { id: user._id, name: user.name, email: user.email },
  };
};