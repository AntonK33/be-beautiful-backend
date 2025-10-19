import { Router } from "express";

import {
  getAllReviewsController,
  getProductReviewsController,
  createReviewController,
  updateReviewController,
  deleteReviewController,
  reactToReviewController,
} from "../controllers/reviews.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { validateBody } from "../middlewares/validateBody.js";
import { createReviewSchema, updateReviewSchema } from "../validation/reviews.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { isValidId } from "../middlewares/isValidId.js";

const router = Router();

// GET /api/reviews - Get all reviews (public, no auth required)
router.get("/", ctrlWrapper(getAllReviewsController));

// POST /api/reviews - Create new review (requires authentication)
router.post("/", authMiddleware, validateBody(createReviewSchema), ctrlWrapper(createReviewController));

// PATCH /api/reviews/:reviewId - Update review (requires authentication)
router.patch("/:reviewId", authMiddleware, validateBody(updateReviewSchema), ctrlWrapper(updateReviewController));

// DELETE /api/reviews/:reviewId - Delete review (requires authentication)
router.delete("/:reviewId", authMiddleware, ctrlWrapper(deleteReviewController));

// PATCH /api/reviews/:reviewId/react - Like/dislike review (requires authentication)
router.patch("/:reviewId/react", isValidId, authMiddleware, ctrlWrapper(reactToReviewController));

export default router;
