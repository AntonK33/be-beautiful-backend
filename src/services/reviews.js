import { ReviewModel } from "../db/models/review.js";
import { UsersCollection } from "../db/models/auth.js";
import { calculatePaginationData } from "../utils/calculatePaginationData.js";

export const getAllReviews = async (page = 1, limit = 10) => {
  try {
    const skip = (page - 1) * limit;
    
    // Simple approach - just get reviews without population first
    const [reviews, total] = await Promise.all([
      ReviewModel.find()
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
          _id: review.userId,
          name: "Anonymous" // Simplified for now
        }
      })),
      pagination: {
        page: paginationData.page,
        limit: paginationData.perPage,
        total: paginationData.totalItems,
        pages: paginationData.totalPages
      }
    };
  } catch (error) {
    console.error('Database error in getAllReviews:', error);
    throw new Error('Failed to fetch reviews from database');
  }
};

export const getReviewsByProductId = async (productId, page = 1, limit = 10) => {
  try {
    const skip = (page - 1) * limit;
    
    // Simple approach - just get reviews without complex aggregation
    const [reviews, total] = await Promise.all([
      ReviewModel.find({ productId })
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
          _id: review.userId,
          name: "Anonymous" // Simplified for now
        }
      })),
      pagination: {
        page: paginationData.page,
        limit: paginationData.perPage,
        total: paginationData.totalItems,
        pages: paginationData.totalPages
      }
    };
  } catch (error) {
    console.error('Database error in getReviewsByProductId:', error);
    throw new Error('Failed to fetch product reviews from database');
  }
};

export const createReview = async ({ userId, productId, rating, comment }) => {
  try {
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
          name: `${populatedReview.userId.first_name || ''} ${populatedReview.userId.last_name || ''}`.trim() || 'Anonymous'
        }
      }
    };
  } catch (error) {
    console.error('Database error in createReview:', error);
    if (error.code === 409) {
      throw error; // Re-throw 409 errors
    }
    throw new Error('Failed to create review in database');
  }
};

export const updateReview = async (reviewId, userId, payload) => {
  try {
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
  } catch (error) {
    console.error('Database error in updateReview:', error);
    throw new Error('Failed to update review in database');
  }
};

export const deleteReview = async (reviewId, userId) => {
  try {
    const review = await ReviewModel.findOneAndDelete({ _id: reviewId, userId });
    return !!review;
  } catch (error) {
    console.error('Database error in deleteReview:', error);
    throw new Error('Failed to delete review from database');
  }
};
