import { WebReviewModel } from "../db/models/webReviews.js";

export const createReview = async (reviewData) => {
  return await WebReviewModel.create(reviewData);
};

export const getReviews = async (limit = 10, page = 1) => {
  const skip = (page - 1) * limit;
  const [reviews, total] = await Promise.all([
    WebReviewModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
    WebReviewModel.countDocuments(),
  ]);

  return {
    reviews,
    total,
    page,
    perPage: limit,
    totalPages: Math.ceil(total / limit),
  };
};

export const deleteReviewById = async (id) => {
  return await WebReviewModel.findByIdAndDelete(id);
};
