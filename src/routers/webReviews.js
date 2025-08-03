import { Router } from "express";

import {
  deleteReview,
  getAllReviews,
  postReview,
  reactToReview,
} from "../controllers/webReviewsController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", getAllReviews);
router.post("/", postReview);
router.delete("/:id", deleteReview);
router.patch("/:id/react", authMiddleware, reactToReview);

export default router;
