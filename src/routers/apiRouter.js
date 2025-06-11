import express from "express";

import authRouter from "./auth.js";
import transactionsRouter from "./transactions.js";
import productsRouter from "./products.js";
import reviewsRouter from "./reviews.js";

const apiRouter = express.Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/transactions", transactionsRouter);
apiRouter.use("/products", productsRouter);
apiRouter.use("/reviews", reviewsRouter);

export default apiRouter;
