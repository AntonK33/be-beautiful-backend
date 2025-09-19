import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import {
    getCartController,
    getCartItemController,
    addCartItemController,
    addCartItemsBulkController,
    updateCartItemController,
    updateCartItemsBulkController,
    deleteCartItemController,
    clearCartController
} from '../controllers/cartController.js';

const router = express.Router();

router.get('/', authMiddleware, getCartController);
router.get('/:productId', authMiddleware, getCartItemController);

router.post('/bulk', authMiddleware, addCartItemsBulkController);
router.post('/', authMiddleware, addCartItemController);

router.put('/bulk', authMiddleware, updateCartItemsBulkController);
router.put('/:productId', authMiddleware, updateCartItemController);


router.delete('/:productId', authMiddleware, deleteCartItemController);
router.delete('/', authMiddleware, clearCartController);

export default router;
