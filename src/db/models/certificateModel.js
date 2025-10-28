import { Schema, model, Types } from 'mongoose';

const certificateSchema = new Schema(
    {
        number: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        balance: {
            type: Number,
            default: function () {
                return this.amount;
            },
        },
        isActive: {
            type: Boolean,
            default: false,
        },
        owner: {
            type: Types.ObjectId,
            ref: 'User',
            default: null,
        },
        activatedAt: {
            type: Date,
            default: null,
        },
        expiresAt: {
            type: Date,
            default: null,
        },
        activatedBy: {
            type: Types.ObjectId,
            ref: 'User',
            default: null,
        },
    },
    { timestamps: true }
);

export const CertificateModel = model('Certificate', certificateSchema);
