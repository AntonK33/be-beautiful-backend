import { Schema, model } from "mongoose";

const webReviewSchema = new Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, maxlength: 1000 },
  },
  { timestamps: true, versionKey: false }
);

export const WebReviewModel = model("webReviews", webReviewSchema);
