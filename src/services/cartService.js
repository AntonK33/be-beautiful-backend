import createHttpError from 'http-errors';
import { CartModel } from '../db/models/cartModel.js';
import { ProductModel } from '../db/models/products.js';

export const addInCart = async (userId, productId, quantity) => {
    // check product in base
    const product = await ProductModel.findById(productId);
    if (!product) throw createHttpError(404, 'Product not found');

    // find cart 
    let cart = await CartModel.findOne({ userId });

    if (!cart) {
        // if cart doesn't exist, create new one
        if (quantity > product.stockQuantity) {
            throw createHttpError(400, 'Not enough stock');
        }

        cart = await CartModel.create({ userId, items: [{ productId, quantity }] });
    } else {
        // check if product is already in the cart
        const existingItem = cart.items.find(item => item.productId.equals(productId));

        if (existingItem) {
            const newQuantity = existingItem.quantity + quantity;
            if (newQuantity > product.stockQuantity) {
                throw createHttpError(400, 'Not enough stock');
            }
            existingItem.quantity = newQuantity;
        } else {
            if (quantity > product.stockQuantity) {
                throw createHttpError(400, 'Not enough stock');
            }

            cart.items.push({ productId, quantity });
        }

        await cart.save();
    }

    return cart;
};

export const getCart = async (userId) => {
    const cart = await CartModel.findOne({ userId }).populate('items.productId');
    return cart;
};

export const updateCartItem = async (userId, productId, quantity) => {
    const product = await ProductModel.findById(productId);
    if (!product) throw createHttpError(404, 'Product not found');

    if (quantity > product.stockQuantity) {
        throw createHttpError(400, 'Not enough stock');
    }

    const cart = await CartModel.findOne({ userId });
    if (!cart) throw createHttpError(404, 'Cart not found');

    const item = cart.items.find(item => item.productId.equals(productId));
    if (!item) throw createHttpError(404, 'Product not in cart');

    item.quantity = quantity;
    await cart.save();

    return cart;
};

export const deleteCartItem = async (userId, productId) => {
    const cart = await CartModel.findOne({ userId });
    if (!cart) throw createHttpError(404, 'Cart not found');

    cart.items = cart.items.filter(item => !item.productId.equals(productId));
    await cart.save();

    return cart;
};
