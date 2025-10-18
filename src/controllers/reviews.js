import * as reviewService from "../services/reviews.js";
import createHttpError from "http-errors";

// GET /api/reviews - Get all reviews (public, no auth required)
export const getAllReviewsController = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    const result = await reviewService.getAllReviews(pageNum, limitNum);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

// GET /api/products/:productId/reviews - Get reviews for specific product (public, no auth required)
export const getProductReviewsController = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    if (!productId) {
      return next(createHttpError(400, "Product ID is required"));
    }

    const result = await reviewService.getReviewsByProductId(productId, pageNum, limitNum);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

// POST /api/reviews - Create new review (requires authentication)
export const createReviewController = async (req, res, next) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.user;

    const result = await reviewService.createReview({
      userId,
      productId,
      rating,
      comment,
    });
    res.status(201).json(result);
  } catch (err) {
    if (err.code === 409) {
      return next(createHttpError(409, "You have already reviewed this product"));
    }
    if (err.code === 11000) {
      return next(createHttpError(409, "You have already reviewed this product"));
    }
    next(err);
  }
};

// PATCH /api/reviews/:reviewId - Update review (requires authentication)
export const updateReviewController = async (req, res, next) => {
  try {
    const userId = req.user;
    const { reviewId } = req.params;

    const result = await reviewService.updateReview(reviewId, userId, req.body);
    if (!result) {
      return next(createHttpError(404, "Review not found or not authorized"));
    }

    res.json(result);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/reviews/:reviewId - Delete review (requires authentication)
export const deleteReviewController = async (req, res, next) => {
  try {
    const userId = req.user;
    const { reviewId } = req.params;

    const deleted = await reviewService.deleteReview(reviewId, userId);
    if (!deleted) {
      return next(createHttpError(404, "Review not found or not authorized"));
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
