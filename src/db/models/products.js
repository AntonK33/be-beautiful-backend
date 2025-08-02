import { Schema, model } from "mongoose";

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    sku: { type: String, default: "" },
    volumeOptions: {
      type: [String],
      required: true,
    },
    priceByVolume: [
      {
        volume: { type: String, required: true },
        price: { type: Number, required: true },
      },
    ],
    stockQuantity: {
      type: Number,
      required: true,
      default: 0,
    },
    features: {
      type: [String],
      required: true,
    },
    description: String,
    instructions: String,
    activeIngredients: [
      {
        name: String,
        description: String,
      },
    ],
    inciList: [String],
    category: {
      type: String,
      enum: ["hair", "face", "body", "makeup", "home"],
      default: "hair",
      required: true,
    },
    reviews: {
      userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
      productId: {
        type: Schema.Types.ObjectId,
        ref: "products",
        required: true,
      },
      rating: { type: Number, required: true, min: 1, max: 5 },
      comment: { type: String, maxlength: 1000 },
    },
    isVegan: { type: Boolean, default: false },
    isPromoted: { type: Boolean, default: false },
    imageUrl: String,
    inStock: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false }
);

export const ProductModel = model("Product", productSchema);
