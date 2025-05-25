import { Schema, model, Types } from 'mongoose';

const orderItemSchema = new Schema(
    {
        product: { type: Types.ObjectId, ref: 'products', required: true },
        selectedVolume: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
    },
    { _id: false }
);


const orderSchema = newSchema({
    clientId: { type: String, required: true },
    customerName: { type: String },
    phone: { type: String },
    email: { type: String },
    comment: { type: String },

    deliveryMethod: {
        type: String,
        enum: ['pickup', 'delivery'],
        default: 'delivery',
    },
    items: [orderItemSchema],
    totalAmount: Number,
    paymentLink: String,
    lowStockWarning: { type: Boolean, default: false },
    status: {
        type: String,
        enum: ['new', 'confirmed', 'paid', 'shipped', 'cancelled'],
        default: 'new',
    },
},
    {
        timestamps: true,
        versionKey: false,

    })