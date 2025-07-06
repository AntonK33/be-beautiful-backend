import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import {
    getCartController,
    addInCartController,
    updateCartItemController,
    deleteCartItemController,
} from '../controllers/cartController.js';

const router = express.Router();


router.get('/', authMiddleware, getCartController);
router.post('/', authMiddleware, addInCartController);
router.put('/', authMiddleware, updateCartItemController);
router.delete('/:productId', authMiddleware, deleteCartItemController);

export default router;
