import express from "express";
import authRouter from "./auth.js";
import productsRouter from "./products.js";
import reviewsRouter from "./reviews.js";
import orderRouter from "./orders.js";
import cartRoutes from "./cartRoutes.js"
import clientsRoutes from "./clientsRoutes.js"
const apiRouter = express.Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/products", productsRouter);
apiRouter.use("/reviews", reviewsRouter);
apiRouter.use("/orders", orderRouter);
apiRouter.use("/cart", cartRoutes);
apiRouter.use("/clients", clientsRoutes);

export default apiRouter;
