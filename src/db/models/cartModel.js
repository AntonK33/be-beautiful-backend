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

    selectedVolume: {
        type: Number,
        required: true,
    },
});


cartItemSchema.virtual("selectedPrice").get(function () {
    if (!this.productId || !this.selectedVolume) return null;

    const variant = this.productId.priceByVolume.find(
        v => v.volume === this.selectedVolume
    );

    return variant ? variant.price : null;
});

cartItemSchema.set("toJSON", { virtuals: true });
cartItemSchema.set("toObject", { virtuals: true });

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
