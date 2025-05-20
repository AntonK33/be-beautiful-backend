import express from "express";

import authRouter from "./auth.js";
import transactionsRouter from "./transactions.js";

const apiRouter = express.Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/transactions", transactionsRouter);

export default apiRouter;
