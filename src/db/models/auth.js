import { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
   first_name: {
      type: String,
      trim: true,
    },
    last_name: {
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
    photo: { type: String },
    
    telephone: {
      type: String,
    },
    dateOfBirth: {
      type: String,
    },
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
    agree: {
      type: String,
      default: "true",
      enum: ["true", "false"],
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
