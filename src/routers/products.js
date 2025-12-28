import { Router } from "express";

import {
  getProductsController,
  getProductByIdController,
  createProductController,
  deleteProductController,
  patchProductController,
  getHomeProductsController
} from "../controllers/products.js";
import { getProductReviewsController } from "../controllers/reviews.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { validateBody } from "../middlewares/validateBody.js";
import {
  createProductSchema,
  updateProductSchema,
} from "../validation/products.js";
import { upload } from "../middlewares/multer.js";

const router = Router();

router.get("/", ctrlWrapper(getProductsController));
router.get("/home", ctrlWrapper(getHomeProductsController));
router.get("/:productId/reviews", ctrlWrapper(getProductReviewsController));
router.get("/:productId", ctrlWrapper(getProductByIdController));

router.post(
  "/",
  upload.single("imageUrl"),
  ctrlWrapper(createProductController),
  validateBody(createProductSchema)
);

router.patch(
  "/:productId",
  upload.single("imageUrl"),
  ctrlWrapper(patchProductController),
  validateBody(updateProductSchema)
);

router.delete("/:productId", ctrlWrapper(deleteProductController));

export default router;
