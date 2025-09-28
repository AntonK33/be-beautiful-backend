import { Schema, model, Types } from 'mongoose';

const orderItemSchema = new Schema(
    {
        product: { type: Types.ObjectId, ref: 'products', required: true },
        selectedVolume: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
    },
    { _id: false }
);


const orderSchema = new Schema({
    clientId: { type: String, required: true },
    customerName: { type: String },
    phone: { type: String },
    email: { type: String },
    comment: { type: String },

    deliveryMethod: {
        type: String,
        enum: ['nova_poshta'],
        default: 'nova_poshta'
    },
    items: [orderItemSchema],
    totalAmount: Number,
    paymentLink: String,
    lowStockWarning: { type: Boolean, default: false },
    status: {
        type: String,
        enum: ['draft', 'ordered', 'payed', 'done'],
        default: 'draft',
    },
},
    {
        timestamps: true,
        versionKey: false,

    })

export const OrderModel = model('orders', orderSchema)