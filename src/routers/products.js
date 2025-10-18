import { Router } from "express";

import {
  getProductsController,
  getProductByIdController,
  createProductController,
  deleteProductController,
  patchProductController,
} from "../controllers/products.js";
import { getProductReviewsController } from "../controllers/reviews.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { validateBody } from "../middlewares/validateBody.js";
import {
  createProductSchema,
  updateProductSchema,
} from "../validation/products.js";

const router = Router();

router.get("/", ctrlWrapper(getProductsController));

// GET /api/products/:productId/reviews - Get reviews for specific product (MUST be before /:productId)
router.get("/:productId/reviews", ctrlWrapper(getProductReviewsController));

router.get("/:productId", ctrlWrapper(getProductByIdController));

router.post(
  "/",
  ctrlWrapper(createProductController),
  validateBody(createProductSchema)
);

router.patch(
  "/:productId",
  ctrlWrapper(patchProductController),
  validateBody(updateProductSchema)
);

router.delete("/:productId", ctrlWrapper(deleteProductController));

export default router;
