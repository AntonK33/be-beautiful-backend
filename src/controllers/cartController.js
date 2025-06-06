import createHttpError from 'http-errors';
import {
    addInCart,
    getCart,
    updateCartItem,
    deleteCartItem,
} from '../services/cartService.js';
import { cartItemsSchema } from '../validation/cartSchemas.js';



//add
export const addInCartController = async (req, res, next) => {
    try {
        const { error, value } = cartItemsSchema.validate(req.body);
        if (error) {
            throw createHttpError(400, error.details[0].message);
        }

        const userId = req.user._id;

        for (const item of value.items) {
            await addInCart(userId, item.productId, item.quantity);
        }

        const cart = await getCart(userId);

        res.status(201).json(cart);
    } catch (err) {
        next(err);
    }
};



//get
export const getCartController = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const cart = await getCart(userId);
        if (!cart) return res.json({ items: [] });
        res.json(cart);
    } catch (err) {
        next(err);
    }
};


//update
export const updateCartItemController = async (req, res, next) => {
    try {
        const { error, value } = cartItemSchema.validate(req.body);
        if (error) {
            throw createHttpError(400, error.details[0].message);
        }

        const { productId, quantity } = value;
        const userId = req.user._id;
        const cart = await updateCartItem(userId, productId, quantity);

        res.json(cart);
    } catch (err) {
        next(err);
    }
};

//delete
export const deleteCartItemController = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const userId = req.user._id;

        const cart = await deleteCartItem(userId, productId);
        res.json(cart);
    } catch (err) {
        next(err);
    }
};
