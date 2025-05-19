import createHttpError from "http-errors";
import bcrypt from "bcrypt";

import { UsersCollection } from "../db/models/auth.js";
import { SessionCollection } from "../db/models/session.js";

export const registerUser = async (payload, file) => {
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

  const newUser = await UsersCollection.create(payload);

  return newUser.email;
};

export const loginUser = async (email, password) => {
  const user = await UsersCollection.findOne({
    email: email.toLowerCase(),
  });

  if (!user) {
    throw createHttpError(401, "Credentials not verified");
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw createHttpError(401, "Credentials not verified");
  }
  const userId = user._id;

  await SessionCollection.deleteOne({ userId });

  return await createAndSaveSession(userId);
};
