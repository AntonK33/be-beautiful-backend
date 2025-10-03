import createHttpError from "http-errors";
import crypto from "crypto";
import bcrypt from "bcrypt";

import { UsersCollection } from "../db/models/auth.js";
import { SessionCollection } from "../db/models/session.js";

const createSession = () => {
  const accessToken = crypto.randomBytes(30).toString("base64");
  const refreshToken = crypto.randomBytes(30).toString("base64");

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  };
};

const createAndSaveSession = async (userId, deviceInfo) => {
  // // Очистка старых сессий (например, оставляем только 3 последних) Start
  // const sessions = await SessionCollection.find({ userId }).sort({
  //   createdAt: -1,
  // });

  // if (sessions.length >= 3) {
  //   await SessionCollection.deleteMany({
  //     _id: { $in: sessions.slice(3).map((s) => s._id) },
  //   });
  // }
  // // Очистка старых сессий (например, оставляем только 3 последних) Finish
  const newSession = createSession();

  return await SessionCollection.create({
    userId,
    ...newSession,
    ...deviceInfo,
  });
};

export const registerUser = async (payload, req) => {
  const userExists = await UsersCollection.findOne({
    email: payload.email,
  });

  if (userExists) {
    throw createHttpError(409, "Email already in use");
  }

  payload.password = await bcrypt.hash(payload.password, 10);

  const user = await UsersCollection.create(payload);

  const deviceInfo = {
    device: req.headers["user-agent"],
    ip: req.ip,
  };

  return await createAndSaveSession(user._id, deviceInfo);
};

export const loginUser = async (email, password, req) => {
  const user = await UsersCollection.findOne({
    email: email.toLowerCase(),
  });

  if (!user) {
    throw createHttpError(401, "User not found");
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw createHttpError(401, "Unauthorized");
  }

  const deviceInfo = {
    device: req.headers["user-agent"],
    ip: req.ip,
  };

  return await createAndSaveSession(user._id, deviceInfo);
};

export const refreshSession = async (refreshToken) => {
  const session = await SessionCollection.findOne({ refreshToken });

  if (!session) {
    throw createHttpError(401, "Session not found");
  }

  if (new Date() > session.refreshTokenValidUntil) {
    throw createHttpError(401, "Refresh token expired");
  }

  const deviceInfo = {
    device: session.device,
    ip: session.ip,
  };

  await SessionCollection.deleteOne({ refreshToken });
  return await createAndSaveSession(session.userId, deviceInfo);
};

export const logoutUser = async (accessToken) => {
  if (!accessToken) {
    throw createHttpError(401, "Session not found");
  }

  return await SessionCollection.deleteOne({ accessToken });
};

export const getCurrentUser = async (userId) => {
  const user = await UsersCollection.findById(userId);

  if (!user) {
    throw createHttpError(404, "User not found");
  }

  return user;
};

export const updateUser = async (userId, updateData, file) => {
  if (file) {
    // multer кладёт путь к файлу в file.path
    updateData.avatarUrl = `/uploads/${file.filename}`;
  }

  const updatedUser = await UsersCollection.findByIdAndUpdate(
    userId,
    { ...updateData },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedUser) {
    throw createHttpError(404, "User not found");
  }

  return updatedUser;
};
