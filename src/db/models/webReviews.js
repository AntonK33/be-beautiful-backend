import { Schema, model } from "mongoose";

const webReviewSchema = new Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, maxlength: 1000 },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    likedBy: [{ type: Schema.Types.ObjectId, ref: "users" }],
    dislikedBy: [{ type: Schema.Types.ObjectId, ref: "users" }],
  },
  { timestamps: true, versionKey: false }
);

export const WebReviewModel = model("webReviews", webReviewSchema);
