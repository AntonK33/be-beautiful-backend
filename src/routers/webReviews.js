import { Router } from "express";

import {
  deleteReview,
  getAllReviews,
  postReview,
  reactToReview,
} from "../controllers/webReviewsController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";

const router = Router();

router.get("/", ctrlWrapper(getAllReviews));
router.post("/", ctrlWrapper(postReview));
router.delete("/:id", ctrlWrapper(deleteReview));
router.patch("/:id/react", authMiddleware, ctrlWrapper(reactToReview));

export default router;
