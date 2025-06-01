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

router.post('/', createOrderController);
router.patch('/:id', updateOrderController);
router.delete('/:id', deleteOrderController);
router.post('/reserve', reserveProductController);
router.get('/low-stock', getLowStockProductsController);

export default router;