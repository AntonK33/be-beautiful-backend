import express from 'express';
import { authenticate } from '../middleware/authenticate.js';
import {
    getCartController,
    addInCartController,
    updateCartItemController,
    deleteCartItemController,
} from '../controllers/cartController.js';

const router = express.Router();


router.get('/cart', authenticate, getCartController);
router.post('/cart', authenticate, addInCartController);
router.put('/cart', authenticate, updateCartItemController);
router.delete('/cart/:productId', authenticate, deleteCartItemController);

export default router;
