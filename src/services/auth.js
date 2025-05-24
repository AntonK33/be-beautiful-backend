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
  // Очистка старых сессий (например, оставляем только 10 последних) Start
  const sessions = await SessionCollection.find({ userId }).sort({
    createdAt: -1,
  });

  if (sessions.length >= 10) {
    await SessionCollection.deleteMany({
      _id: { $in: sessions.slice(10).map((s) => s._id) },
    });
  }
  // Очистка старых сессий (например, оставляем только 10 последних) Finish
  const newSession = createSession();

  return await SessionCollection.create({
    userId,
    ...newSession,
    ...deviceInfo,
  });
};

const saveAvatar = async (file) => {
  let cloudinaryUrl = null;
  let localUrl = null;

  if (
    process.env.STORAGE_TYPE === "cloudinary" ||
    process.env.STORAGE_TYPE === "both"
  ) {
    const result = await uploadToCloudinary(file.path);
    cloudinaryUrl = result.secure_url;
  }

  if (
    process.env.STORAGE_TYPE === "local" ||
    process.env.STORAGE_TYPE === "both"
  ) {
    const uploadsDir = path.resolve("src", "public/photos");
    await fs.mkdir(uploadsDir, { recursive: true });

    const avatarFilename = `${Date.now()}-${file.originalname}`;
    const avatarFinalPath = path.resolve(uploadsDir, avatarFilename);

    await fs.rename(file.path, avatarFinalPath);
    localUrl = `/photos/${avatarFilename}`;
  }

  return { cloudinaryUrl, localUrl };
};

const deleteAvatar = async (avatarUrl, storageType) => {
  if (!avatarUrl) return;

  try {
    if (storageType === "cloudinary") {
      const publicId = avatarUrl.split("/").slice(-1)[0].split(".")[0];
      await cloudinary.v2.uploader.destroy(publicId);
    } else if (storageType === "local") {
      const filePath = path.resolve("src", "public", avatarUrl);
      await fs.unlink(filePath);
    }
  } catch (error) {
    console.warn("Failed to delete avatar:", error.message);
  }
};

export const registerUser = async (payload, file, req) => {
  const userExists = await UsersCollection.findOne({
    email: payload.email,
  });

  if (userExists) {
    throw createHttpError(409, "Email already in use");
  }

  payload.password = await bcrypt.hash(payload.password, 10);

  if (file) {
    const { cloudinaryUrl, localUrl } = await saveAvatar(file);

    payload.avatarUrlCloudinary = cloudinaryUrl;
    payload.avatarUrlLocal = localUrl;
  }

  const user = await UsersCollection.create(payload);

  const deviceInfo = {
    device: req.headers["user-agent"],
    ip: req.ip,
  };
  // return user.email;

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
  // const userId = user._id
  // await SessionCollection.deleteOne({ userId });

  const deviceInfo = {
    device: req.headers["user-agent"],
    ip: req.ip,
  };

  return await createAndSaveSession(user._id, deviceInfo);
};

export const logoutUser = async (accessToken) => {
  if (!accessToken) {
    throw createHttpError(401, "Session not found");
  }

  return await SessionCollection.deleteOne({ accessToken });
};
