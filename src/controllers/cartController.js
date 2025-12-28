import createHttpError from 'http-errors';
import {
    addInCart,
    addInCartBulk,
    getCart,
    getCartItem,
    updateCartItem,
    updateCartItemsBulk,
    deleteCartItem,
    clearCart
} from '../services/cartService.js';
import { cartItemsSchema } from '../validation/cartSchemas.js';

// get all
export const getCartController = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const cart = await getCart(userId);
        res.json(cart || { items: [] });
    } catch (err) {
        next(err);
    }
};

//get one
export const getCartItemController = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const userId = req.user._id;
        const item = await getCartItem(userId, productId);
        res.json(item);
    } catch (err) {
        next(err);
    }
};

// add one
export const addCartItemController = async (req, res, next) => {
    try {
        const { productId, quantity, selectedVolume } = req.body;
        if (!productId || !quantity || !selectedVolume) {
            throw createHttpError(400, 'productId, quantity and selectedVolume are required');
        }

        const userId = req.user._id;
        const cart = await addInCart(userId, productId, quantity, selectedVolume);
        res.status(201).json(cart);
    } catch (err) {
        next(err);
    }
};


// add a few
export const addCartItemsBulkController = async (req, res, next) => {
    try {
        const { error, value } = cartItemsSchema.validate(req.body);
        if (error) throw createHttpError(400, error.details[0].message);

        const userId = req.user._id;
        const cart = await addInCartBulk(userId, value.items);
        res.status(201).json(cart);
    } catch (err) {
        next(err);
    }
};


// update one
export const updateCartItemController = async (req, res, next) => {
    try {
        const { quantity, selectedVolume } = req.body;
        if (!quantity || quantity < 1 || !selectedVolume) {
            throw createHttpError(400, '"quantity" must be at least 1 and "selectedVolume" is required');
        }

        const { productId } = req.params;
        const userId = req.user._id;
        const cart = await updateCartItem(userId, productId, quantity, selectedVolume);
        res.json(cart);
    } catch (err) {
        next(err);
    }
};


// update a few
export const updateCartItemsBulkController = async (req, res, next) => {
    try {
        const { error, value } = cartItemsSchema.validate(req.body);
        if (error) throw createHttpError(400, error.details[0].message);

        const userId = req.user._id;
        const cart = await updateCartItemsBulk(userId, value.items);
        res.json(cart);
    } catch (err) {
        next(err);
    }
};


// delete one
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

// delete all
export const clearCartController = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const cart = await clearCart(userId);
        res.json(cart);
    } catch (err) {
        next(err);
    }
};
