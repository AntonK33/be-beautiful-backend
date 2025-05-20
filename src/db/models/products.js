import { Schema, model } from 'mongoose';

const productSchema = new Schema(
    {
        name: { type: String, required: true },
        volumeOptions: {
            type: [String],
            required: true,
        },
        features: {
            type: [String],
            required: true,
        },
        description: String,
        instructions: String,
        activeIngredients: [
            {
                name: String,
                description: String,
            },
        ],
        inciList: [String],
        category: {
            type: String,
            enum: ['hair', 'face', 'body', 'makeup', 'home'],
            default: 'hair',
        },
        isVegan: Boolean,
        imageUrl: String,
        inStock: { type: Boolean, default: true },
    },
    { timestamps: true, versionKey: false }
);

export const ProductModel = model('products', productSchema);
