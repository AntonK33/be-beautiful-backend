import createHttpError from 'http-errors';
import { CartModel } from '../db/models/cartModel.js';
import { ProductModel } from '../db/models/products.js';

// getCart
export const getCart = async (userId) => {
    return CartModel.findOne({ userId }).populate('items.productId');
};

// getCartItem
export const getCartItem = async (userId, productId) => {
    const cart = await CartModel.findOne({ userId }).populate('items.productId');
    if (!cart) throw createHttpError(404, 'Cart not found');

    const item = cart.items.find(i => i.productId._id.equals(productId));
    if (!item) throw createHttpError(404, 'Product not in cart');

    return item;
};

// addInCart
export const addInCart = async (userId, productId, quantity, selectedVolume) => {
    const product = await ProductModel.findById(productId);
    if (!product) throw createHttpError(404, 'Product not found');

    const variant = product.priceByVolume.find(v => v.volume === selectedVolume);
    if (!variant) throw createHttpError(400, "Volume not found");

    let cart = await CartModel.findOne({ userId });

    const existingItem = cart ? cart.items.find(i => i.productId.equals(productId)) : null;
    const newQuantity = existingItem ? existingItem.quantity + quantity : quantity;

    if (newQuantity > variant.stockQuantity) {
        throw createHttpError(400, "Not enough stock for this volume");
    }

    if (!cart) {
        return CartModel.create({
            userId,
            items: [{
                productId,
                quantity,
                selectedVariantId: variant._id,
            }],
        });
    }

    if (existingItem) {
        existingItem.quantity = newQuantity;
        existingItem.selectedVariantId = variant._id;
    } else {
        cart.items.push({
            productId,
            quantity,
            selectedVariantId: variant._id,
        });
    }

    await cart.save();
    return getCart(userId);
};


// addInCartBulk
export const addInCartBulk = async (userId, items) => {
    for (const { productId, quantity, selectedVolume } of items) {
        await addInCart(userId, productId, quantity, selectedVolume);
    }
    return getCart(userId);
};

// updateCartItem
export const updateCartItem = async (userId, productId, quantity, selectedVolume) => {
    const product = await ProductModel.findById(productId);
    if (!product) throw createHttpError(404, 'Product not found');

    const variant = product.priceByVolume.find(v => v.volume === selectedVolume);
    if (!variant) throw createHttpError(400, "Volume not found");

    if (quantity > variant.stockQuantity) {
        throw createHttpError(400, "Not enough stock for this volume");
    }

    const cart = await CartModel.findOne({ userId });
    if (!cart) throw createHttpError(404, 'Cart not found');

    const item = cart.items.find(i => i.productId.equals(productId));
    if (!item) throw createHttpError(404, 'Product not in cart');

    item.quantity = quantity;
    item.selectedVariantId = variant._id;

    await cart.save();
    return getCart(userId);
};


// updateCartItemsBulk
export const updateCartItemsBulk = async (userId, items) => {
    for (const { productId, quantity, selectedVolume } of items) {
        await updateCartItem(userId, productId, quantity, selectedVolume);
    }

    return getCart(userId);
};


// deleteCartItem
export const deleteCartItem = async (userId, productId) => {
    const cart = await CartModel.findOne({ userId });
    if (!cart) throw createHttpError(404, 'Cart not found');

    cart.items = cart.items.filter(i => String(i.productId) !== String(productId));
    await cart.save();
    return cart;
};

// clearCart
export const clearCart = async (userId) => {
    const cart = await CartModel.findOne({ userId });
    if (!cart) throw createHttpError(404, 'Cart not found');

    cart.items = [];
    await cart.save();
    return cart;
};
