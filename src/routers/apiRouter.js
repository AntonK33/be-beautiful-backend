import express from "express";
import authRouter from "./auth.js";
import transactionsRouter from "./transactions.js";
import productsRouter from "./products.js";
import orderRouter from "./orders.js";
import cartRoutes from "./cartRoutes.js"


const apiRouter = express.Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/transactions", transactionsRouter);
apiRouter.use("/products", productsRouter);
apiRouter.use("/orders", orderRouter);
apiRouter.use("/cart", cartRoutes);
export default apiRouter;
