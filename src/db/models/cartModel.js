import { Schema, model, Types } from 'mongoose';

const cartItemSchema = new Schema({
    productId: {
        type: Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity must be at least 1'],
    },
});

const cartSchema = new Schema(
    {
        userId: {
            type: Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        items: {
            type: [cartItemSchema],
            default: [],
        },

    },
    { timestamps: true }
);

export const CartModel = model('Cart', cartSchema);
