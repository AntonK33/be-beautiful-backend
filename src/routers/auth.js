import { Router } from "express";

import { registerController } from "../controllers/auth.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { validateBody } from "../middlewares/validateBody.js";
// import { upload } from "../middlewares/multer.js";
// import { authentication } from "../middlewares/authentication.js";
import { registerUserSchema } from "../validation/auth.js";

const authRouter = Router();

authRouter.post(
  "/register",
  // upload.single("avatarUrlLocal"),
  validateBody(registerUserSchema),
  ctrlWrapper(registerController)
);

export default authRouter;
