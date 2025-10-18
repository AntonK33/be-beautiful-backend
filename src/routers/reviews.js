import { Router } from "express";

import {
  getAllReviewsController,
  getProductReviewsController,
  createReviewController,
  updateReviewController,
  deleteReviewController,
} from "../controllers/reviews.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { validateBody } from "../middlewares/validateBody.js";
import { createReviewSchema, updateReviewSchema } from "../validation/reviews.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";

const router = Router();

// GET /api/reviews - Get all reviews (public, no auth required)
router.get("/", ctrlWrapper(getAllReviewsController));

// POST /api/reviews - Create new review (requires authentication)
router.post("/", authMiddleware, validateBody(createReviewSchema), ctrlWrapper(createReviewController));

// PATCH /api/reviews/:reviewId - Update review (requires authentication)
router.patch("/:reviewId", authMiddleware, validateBody(updateReviewSchema), ctrlWrapper(updateReviewController));

// DELETE /api/reviews/:reviewId - Delete review (requires authentication)
router.delete("/:reviewId", authMiddleware, ctrlWrapper(deleteReviewController));

export default router;
