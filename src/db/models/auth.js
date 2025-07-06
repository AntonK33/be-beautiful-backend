import { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    // avatarUrlCloudinary: {
    //   type: String,
    //   default: null,
    // },
    // avatarUrlLocal: {
    //   type: String,
    //   default: null,
    // },
    gender: {
      type: String,
      enum: ["woman", "man"],
      default: "woman",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    language: { type: String, enum: ["en", "uk"], default: "uk" },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const UsersCollection = model("User", userSchema);
