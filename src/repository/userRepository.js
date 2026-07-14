import userModel from "../models/User.js";

export const findUserByEmail = async (email) => {
  return await userModel.findOne({ email });
};

export const findUserById = async (id) => {
  return await userModel.findById(id);
};

export const createUser = async (userData) => {
  const user = new userModel(userData);
  return await user.save();
};

export const updateVerificationCode = async (userId, code, expiresAt) => {
  return await userModel.findByIdAndUpdate(
    userId,
    { verificationCode: code, verificationCodeExpiresAt: expiresAt },
    { new: true }
  );
};

export const markUserVerified = async (userId) => {
  return await userModel.findByIdAndUpdate(
    userId,
    { isVerified: true, verificationCode: null, verificationCodeExpiresAt: null },
    { new: true }
  );
};