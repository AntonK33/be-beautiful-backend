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

    selectedVariantId: {
        type: Types.ObjectId,
        ref: 'Product.priceByVolume',
        required: true,
    },
});

cartItemSchema.virtual("selectedVariant").get(function () {
    if (!this.productId || !this.selectedVariantId) return null;

    return this.productId.priceByVolume.find(
        v => v._id.equals(this.selectedVariantId)
    );
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
