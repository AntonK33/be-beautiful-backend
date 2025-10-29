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
import { upload } from "../middlewares/multer.js";


const authRouter = Router();

authRouter.post(
  "/register",
   upload.single("photo"),
  validateBody(registerUserSchema),
  ctrlWrapper(registerController)
);

authRouter.post(
  "/login",
  upload.single("photo"),
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
   upload.single('photo'),
  validateBody(updateCurrentUserSchema),
  authMiddleware,
  ctrlWrapper(updateCurrentUserController)
);

authRouter.post("/logout", ctrlWrapper(logoutController));

export default authRouter;
