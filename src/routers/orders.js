 // routes/orders.js
import express from 'express';
import {
    createOrderController,
    updateOrderController,
    deleteOrderController,
    reserveProductController,
    getLowStockProductsController
} from '../controllers/orders.js';

import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import { orderSchema, reserveSchema } from '../validation/orderSchemas.js';

const router = express.Router();

router.post('/', validateBody(orderSchema), createOrderController);
router.patch('/:id', isValidId, validateBody(orderSchema), updateOrderController);
router.delete('/:id', isValidId, deleteOrderController);
router.post('/reserve', validateBody(reserveSchema), reserveProductController);
router.get('/low-stock', getLowStockProductsController);

export default router;