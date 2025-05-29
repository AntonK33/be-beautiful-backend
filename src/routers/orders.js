// routes/orders.js
import express from 'express';
import {
    createOrderController,
    updateOrderController,
    deleteOrderController,
    reserveProductController,
    getLowStockProductsController
} from '../controllers/orders.js';

const router = express.Router();

router.post('/order', createOrderController);
router.patch('/order/:id', updateOrderController);
router.delete('/order/:id', deleteOrderController);
router.post('/product/reserve', reserveProductController);
router.get('/order/low-stock', getLowStockProductsController);

export default router;