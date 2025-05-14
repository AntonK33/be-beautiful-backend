import createHttpError from 'http-errors';
import { SessionsCollection } from '../db/models/session.js';
import { UsersCollection } from '../db/models/user.js';

export const authenticate = async (req, _res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    next(createHttpError(401, 'Please provide Authorization header'));
    return;
  }

  const [bearer, token] = authHeader.split(' ');
  if (bearer !== 'Bearer' || !token) {
    next(createHttpError(401, 'Auth header should be of type Bearer'));
    return;
  }

  const session = await SessionsCollection.findOne({ accessToken: token });
  if (!session) {
    next(createHttpError(401, 'Session not found'));
    return;
  }

  const isExpired = new Date() > new Date(session.accessTokenValidUntil);
  if (isExpired) {
    next(createHttpError(401, 'Access token expired'));
    return;
  }

  const user = await UsersCollection.findOne({ _id: session.userId });
  if (!user) {
    next(createHttpError(401, 'User not found'));
    return;
  }

  req.user = user;
  next();
};
