import { model, Schema } from 'mongoose';

const transactionsSchema = new Schema(
  {
    userId: { type: String, required: true },
    type: { type: String, required: true, enum: ['-', '+'] },
    category: {
      type: String,
      enum: [
        'Main expenses',
        'Products',
        'Car',
        'Self care',
        'Child care',
        'Household products',
        'Education',
        'Leisure',
        'Other expenses',
        'Entertainment',
        'Income',
      ],
      default: 'Income',
    },
    date: { type: Date, required: true },
    summ: { type: Number, required: true },
    comment: { type: String, default: '' },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);
export const TransactionsCollection = model('transactions', transactionsSchema);
