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
  //     _id: { $in: sessions.slice(10).map((s) => s._id) },
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

export const registerUser = async (payload, file, req) => {
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

  if (session.refreshToken !== refreshToken) {
    throw createHttpError(401, "Invalid refresh token");
  }

  if (new Date() > session.refreshTokenValidUntil) {
    throw createHttpError(401, "Refresh token expired");
  }

  await SessionCollection.deleteOne({ refreshToken });
  return await createAndSaveSession(session.userId);
};

export const logoutUser = async (accessToken) => {
  if (!accessToken) {
    throw createHttpError(401, "Session not found");
  }

  return await SessionCollection.deleteOne({ accessToken });
};
