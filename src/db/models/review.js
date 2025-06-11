import { Schema, model } from "mongoose";

const reviewSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
    productId: { type: Schema.Types.ObjectId, ref: "products", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, maxlength: 1000 },
  },
  { timestamps: true, versionKey: false }
);

reviewSchema.index({ userId: 1, productId: 1 }, { unique: true });

export const ReviewModel = model("reviews", reviewSchema);
