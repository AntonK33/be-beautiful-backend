import * as reviewService from "../services/reviews.js";
import createHttpError from "http-errors";

export const getReviewsController = async (req, res, next) => {
  try {
    const { productId } = req.query;
    if (!productId) return next(createHttpError(400, "Product ID is required"));

    const reviews = await reviewService.getReviewsByProductId(productId);
    res.json({ status: 200, data: reviews });
  } catch (err) {
    next(err);
  }
};

export const createReviewController = async (req, res, next) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.user.id;

    const review = await reviewService.createReview({
      userId,
      productId,
      rating,
      comment,
    });
    res.status(201).json({ status: 201, data: review });
  } catch (err) {
    if (err.code === 11000) {
      return next(
        createHttpError(400, "You have already reviewed this product.")
      );
    }
    next(err);
  }
};

export const updateReviewController = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { reviewId } = req.params;

    const updated = await reviewService.updateReview(
      reviewId,
      userId,
      req.body
    );
    if (!updated) return next(createHttpError(403, "Not authorized"));

    res.json({ status: 200, data: updated });
  } catch (err) {
    next(err);
  }
};

export const deleteReviewController = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { reviewId } = req.params;

    const deleted = await reviewService.deleteReview(reviewId, userId);
    if (!deleted) return next(createHttpError(403, "Not authorized"));

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
