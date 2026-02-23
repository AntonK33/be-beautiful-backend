import { Schema, model, Types } from 'mongoose';

const orderItemSchema = new Schema(
    {
        product: { type: Types.ObjectId, ref: 'Product', required: true },
        selectedVolume: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
    },
    { _id: false }
);

const orderSchema = new Schema(
    {
        // === CLIENT ===
        clientId: { type: String, required: true },
        customerName: { type: String },
        phone: { type: String },
        email: { type: String },

        comment: {
            type: String,
            default: "",
        },

        // === DELIVERY ===
        deliveryMethod: {
            type: String,
            enum: ['nova_poshta'],
            default: 'nova_poshta',
        },

        deliveryType: {
            type: String,
            enum: ['address', 'branch'],
            required: true,
        },

        city: { type: String, required: true },

        // for address delivery
        street: { type: String },
        house: { type: String },
        apartment: { type: String },

        // for branch delivery
        branchNumber: { type: String },

        // === PAYMENT ===
        paymentMethod: {
            type: String,
            enum: ['liqpay', 'requisites', 'cod'],
            required: true,
        },

        paymentLink: { type: String },

        // === CERTIFICATE ===
        certificateCode: {
            type: String,
            default: null,
        },

        certificateDiscount: {
            type: Number,
            default: 0,
        },

        // === PRODUCTS ===
        items: {
            type: [orderItemSchema],
            required: true,
        },

        // === SUMS ===
        totalAmount: {
            type: Number,
            default: 0, // сумма товаров
        },

        finalAmount: {
            type: Number,
            default: 0, // сумма к оплате после скидки
        },

        lowStockWarning: {
            type: Boolean,
            default: false,
        },

        status: {
            type: String,
            enum: ['draft', 'ordered', 'payed', 'done'],
            default: 'draft',
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export const OrderModel = model('Order', orderSchema);