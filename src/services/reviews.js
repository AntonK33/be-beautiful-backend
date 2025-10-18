import { ReviewModel } from "../db/models/review.js";
import { UsersCollection } from "../db/models/auth.js";
import { calculatePaginationData } from "../utils/calculatePaginationData.js";

export const getAllReviews = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  
  const [reviews, total] = await Promise.all([
    ReviewModel.find()
      .populate("userId", "first_name last_name")
      .populate("productId", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    ReviewModel.countDocuments()
  ]);

  const paginationData = calculatePaginationData(total, page, limit);

  return {
    success: true,
    data: reviews.map(review => ({
      ...review,
      author: {
        _id: review.userId._id,
        name: `${review.userId.first_name || ''} ${review.userId.last_name || ''}`.trim() || 'Anonymous'
      }
    })),
    pagination: {
      page: paginationData.page,
      limit: paginationData.perPage,
      total: paginationData.totalItems,
      pages: paginationData.totalPages
    }
  };
};

export const getReviewsByProductId = async (productId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  
  const [reviews, total] = await Promise.all([
    ReviewModel.find({ productId })
      .populate("userId", "first_name last_name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    ReviewModel.countDocuments({ productId })
  ]);

  const paginationData = calculatePaginationData(total, page, limit);

  return {
    success: true,
    data: reviews.map(review => ({
      ...review,
      author: {
        _id: review.userId._id,
        name: `${review.userId.first_name || ''} ${review.userId.last_name || ''}`.trim() || 'Anonymous'
      }
    })),
    pagination: {
      page: paginationData.page,
      limit: paginationData.perPage,
      total: paginationData.totalItems,
      pages: paginationData.totalPages
    }
  };
};

export const createReview = async ({ userId, productId, rating, comment }) => {
  // Check if user already reviewed this product
  const existingReview = await ReviewModel.findOne({ userId, productId });
  if (existingReview) {
    const error = new Error("User has already reviewed this product");
    error.code = 409;
    throw error;
  }

  const review = await ReviewModel.create({ userId, productId, rating, comment });
  
  // Populate the created review
  const populatedReview = await ReviewModel.findById(review._id)
    .populate("userId", "first_name last_name")
    .lean();

  return {
    success: true,
    data: {
      ...populatedReview,
      author: {
        _id: populatedReview.userId._id,
        name: `${populatedReview.userId.first_name} ${populatedReview.userId.last_name}`.trim()
      }
    }
  };
};

export const updateReview = async (reviewId, userId, payload) => {
  const review = await ReviewModel.findOneAndUpdate(
    { _id: reviewId, userId },
    payload,
    { new: true, runValidators: true }
  ).populate("userId", "first_name last_name").lean();

  if (!review) return null;

  return {
    success: true,
    data: {
      ...review,
      author: {
        _id: review.userId._id,
        name: `${review.userId.first_name || ''} ${review.userId.last_name || ''}`.trim() || 'Anonymous'
      }
    }
  };
};

export const deleteReview = async (reviewId, userId) => {
  const review = await ReviewModel.findOneAndDelete({ _id: reviewId, userId });
  return !!review;
};
