import createHttpError from "http-errors";
import bcrypt from "bcrypt";

import { UsersCollection } from "../db/models/auth.js";

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
