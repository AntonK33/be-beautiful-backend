import { ReviewModel } from "../db/models/review.js";

export const getReviewsByProductId = async (productId) => {
  return await ReviewModel.find({ productId }).populate("userId", "name");
};

export const createReview = async ({ userId, productId, rating, comment }) => {
  return await ReviewModel.create({ userId, productId, rating, comment });
};

export const updateReview = async (reviewId, userId, payload) => {
  return await ReviewModel.findOneAndUpdate(
    { _id: reviewId, userId },
    payload,
    { new: true, runValidators: true }
  );
};

export const deleteReview = async (reviewId, userId, isAdmin = false) => {
  const filter = isAdmin ? { _id: reviewId } : { _id: reviewId, userId };
  return await ReviewModel.findOneAndDelete(filter);
};
