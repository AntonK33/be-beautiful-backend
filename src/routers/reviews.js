import { Router } from "express";

import {
  getReviewsController,
  createReviewController,
  updateReviewController,
  deleteReviewController,
} from "../controllers/reviews.js";
import { validateReview } from "../validation/reviews.js";

const router = Router();

router.get("/", getReviewsController);
router.post("/", createReviewController);
router.put("/:reviewId", validateReview, updateReviewController);
router.delete("/:reviewId", deleteReviewController);

export default router;
