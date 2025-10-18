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

const router = Router();

// GET /api/reviews - Get all reviews (public, no auth required)
router.get("/", getAllReviewsController);

// POST /api/reviews - Create new review (requires authentication)
router.post("/", authMiddleware, validateBody(createReviewSchema), createReviewController);

// PATCH /api/reviews/:reviewId - Update review (requires authentication)
router.patch("/:reviewId", authMiddleware, validateBody(updateReviewSchema), updateReviewController);

// DELETE /api/reviews/:reviewId - Delete review (requires authentication)
router.delete("/:reviewId", authMiddleware, deleteReviewController);

export default router;
