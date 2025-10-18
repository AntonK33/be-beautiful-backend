import { Schema, model } from "mongoose";

const reviewSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, maxlength: 1000 },
  },
  { timestamps: true, versionKey: false }
);

// Unique constraint: one review per user per product
reviewSchema.index({ userId: 1, productId: 1 }, { unique: true });

// Index for efficient product review queries
reviewSchema.index({ productId: 1, createdAt: -1 });

// Index for efficient user review queries
reviewSchema.index({ userId: 1, createdAt: -1 });

export const ReviewModel = model("reviews", reviewSchema);
