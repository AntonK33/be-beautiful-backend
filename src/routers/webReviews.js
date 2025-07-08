import { Router } from "express";

import {
  getAllReviews,
  postReview,
} from "../controllers/webReviewsController.js";

const router = Router();

router.get("/", getAllReviews);
router.post("/", postReview);

export default router;
