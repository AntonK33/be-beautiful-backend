import { isValidObjectId } from 'mongoose';
import createHttpError from 'http-errors';

export const isValidId = (req, _res, next) => {
  // Check for various ID parameter names
  const idParam = req.params.transactionId || req.params.reviewId || req.params.id || req.params.productId;
  if (isValidObjectId(idParam)) next();
  else throw createHttpError(400, 'Invalid id. Must be of type ObjectId');
};
