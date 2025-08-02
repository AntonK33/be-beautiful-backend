import { Router } from "express";

import {
  getReviewsController,
  createReviewController,
  updateReviewController,
  deleteReviewController,
} from "../controllers/reviews.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", getReviewsController);
router.post("/", authMiddleware, createReviewController);
router.put("/:reviewId", updateReviewController);
router.delete("/:reviewId", deleteReviewController);

export default router;
