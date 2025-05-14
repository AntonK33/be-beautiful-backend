import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

import { ONE_DAY } from '../constants/index.js';
import { UsersCollection } from '../db/models/user.js';
import { SessionsCollection } from '../db/models/session.js';

export const registerUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });

  if (user) throw createHttpError(409, 'Email in use');

  const hashedPassword = await bcrypt.hash(payload.password, 10);

  return await UsersCollection.create({
    ...payload,
    password: hashedPassword,
  });
};

const createSessionData = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + ONE_DAY),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
  };
};

export const loginUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });
  if (!user) throw createHttpError(401, 'User not found');

  const isPasswordEqual = await bcrypt.compare(payload.password, user.password);
  if (!isPasswordEqual) throw createHttpError(401, 'Unauthorized');

  await SessionsCollection.deleteOne({ userId: user._id });

  const sessionData = createSessionData();

  return await SessionsCollection.create({
    userId: user._id,
    ...sessionData,
  });
};

export const refreshUser = async ({ sessionId, refreshToken }) => {
  const currentSession = await SessionsCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!currentSession) throw createHttpError(401, 'Session not found');

  const isRefreshTokenExpired =
    new Date() > new Date(currentSession.refreshTokenValidUntil);

  if (isRefreshTokenExpired)
    throw createHttpError(401, 'Session token expired');

  const sessionData = createSessionData();

  await SessionsCollection.deleteOne({
    _id: sessionId,
    refreshToken,
  });

  return await SessionsCollection.create({
    userId: currentSession.userId,
    ...sessionData,
  });
};

export const logoutUser = async (sessionId) => {
  await SessionsCollection.deleteOne({ _id: sessionId });
};
