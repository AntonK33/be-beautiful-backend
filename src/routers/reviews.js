import { Router } from "express";

import {
  getReviewsController,
  createReviewController,
  updateReviewController,
  deleteReviewController,
} from "../controllers/reviews.js";

const router = Router();

router.get("/", getReviewsController);
router.post("/", createReviewController);
router.put("/:reviewId", updateReviewController);
router.delete("/:reviewId", deleteReviewController);

export default router;
