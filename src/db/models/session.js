import { Schema, model } from "mongoose";
const sessionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
    accessTokenValidUntil: { type: Date, required: true },
    refreshTokenValidUntil: { type: Date, required: true },
    language: { type: String, enum: ["en", "uk"], default: "uk" },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const SessionCollection = model("Session", sessionSchema);
