import * as reviewService from "../services/reviews.js";
import createHttpError from "http-errors";

// GET /api/reviews - Get all reviews (public, no auth required)
export const getAllReviewsController = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    // Validate pagination parameters
    if (pageNum < 1 || limitNum < 1 || limitNum > 100) {
      return next(createHttpError(400, "Invalid pagination parameters"));
    }

    const result = await reviewService.getAllReviews(pageNum, limitNum);
    res.json(result);
  } catch (err) {
    console.error('Error in getAllReviewsController:', err);
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

    // Validate pagination parameters
    if (pageNum < 1 || limitNum < 1 || limitNum > 100) {
      return next(createHttpError(400, "Invalid pagination parameters"));
    }

    const result = await reviewService.getReviewsByProductId(productId, pageNum, limitNum);
    res.json(result);
  } catch (err) {
    console.error('Error in getProductReviewsController:', err);
    next(err);
  }
};

// POST /api/reviews - Create new review (requires authentication)
export const createReviewController = async (req, res, next) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.user;

    if (!userId) {
      return next(createHttpError(401, "Authentication required"));
    }

    const result = await reviewService.createReview({
      userId,
      productId,
      rating,
      comment,
    });
    res.status(201).json(result);
  } catch (err) {
    console.error('Error in createReviewController:', err);
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

    if (!userId) {
      return next(createHttpError(401, "Authentication required"));
    }

    const result = await reviewService.updateReview(reviewId, userId, req.body);
    if (!result) {
      return next(createHttpError(404, "Review not found or not authorized"));
    }

    res.json(result);
  } catch (err) {
    console.error('Error in updateReviewController:', err);
    next(err);
  }
};

// DELETE /api/reviews/:reviewId - Delete review (requires authentication)
export const deleteReviewController = async (req, res, next) => {
  try {
    const userId = req.user;
    const { reviewId } = req.params;

    if (!userId) {
      return next(createHttpError(401, "Authentication required"));
    }

    const deleted = await reviewService.deleteReview(reviewId, userId);
    if (!deleted) {
      return next(createHttpError(404, "Review not found or not authorized"));
    }

    res.status(204).send();
  } catch (err) {
    console.error('Error in deleteReviewController:', err);
    next(err);
  }
};

// PATCH /api/reviews/:reviewId/react - Like/dislike review (requires authentication)
export const reactToReviewController = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const { type } = req.body;
    const userId = req.user;

    if (!["like", "dislike"].includes(type)) {
      return next(createHttpError(400, "Invalid reaction type"));
    }

    if (!userId) {
      return next(createHttpError(401, "Authentication required"));
    }

    const result = await reviewService.updateReviewReaction(reviewId, type, userId);

    if (result === "already liked" || result === "already disliked") {
      return next(createHttpError(400, `You already ${result.split(" ")[1]} this review.`));
    }

    if (result === "cannot like own review") {
      return next(createHttpError(400, "You cannot like your own review."));
    }

    if (!result) {
      return next(createHttpError(404, "Review not found"));
    }

    res.status(200).json({
      success: true,
      message: `Review ${type}d successfully`,
      data: result,
    });
  } catch (err) {
    console.error('Error in reactToReviewController:', err);
    next(err);
  }
};
