import express from "express";
import authRouter from "./auth.js";
import transactionsRouter from "./transactions.js";
import productsRouter from "./products.js";

const apiRouter = express.Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/transactions", transactionsRouter);
apiRouter.use("/products", productsRouter);

export default apiRouter;
