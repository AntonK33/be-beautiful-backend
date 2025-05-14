import { isValidObjectId } from 'mongoose';
import createHttpError from 'http-errors';

export const isValidId = (req, _res, next) => {
  const { transactionId } = req.params;
  if (isValidObjectId(transactionId)) next();
  else throw createHttpError(400, 'Invalid id. Must be of type ObjectId');
};
