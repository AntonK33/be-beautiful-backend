import { Router } from "express";

import {
  getCurrentUserController,
  loginController,
  logoutController,
  refreshTokenController,
  registerController,
  updateCurrentUserController,
} from "../controllers/auth.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { validateBody } from "../middlewares/validateBody.js";
import {
  registerUserSchema,
  loginUserSchema,
  updateCurrentUserSchema,
} from "../validation/auth.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/upload.middleware.js";
import multer from "multer";

const authRouter = Router();

authRouter.post(
  "/register",
   upload.single("avatarUrlLocal"),
  validateBody(registerUserSchema),
  ctrlWrapper(registerController)
);

authRouter.post(
  "/login",
  validateBody(loginUserSchema),
  ctrlWrapper(loginController)
);

authRouter.get(
  "/current",
  // upload.single('avatarUrlLocal'),
  authMiddleware,
  ctrlWrapper(getCurrentUserController)
);

authRouter.post(
  "/refresh",
  authMiddleware,
  ctrlWrapper(refreshTokenController)
);

authRouter.patch(
  "/update-current-user",
   upload.single('avatarUrlLocal'),
  validateBody(updateCurrentUserSchema),
  authMiddleware,
  ctrlWrapper(updateCurrentUserController)
);

authRouter.post("/logout", ctrlWrapper(logoutController));

export default authRouter;
