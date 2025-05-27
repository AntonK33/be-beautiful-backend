import { Schema, model } from "mongoose";

const productSchema = new Schema(
  {
    id: { type: Schema.Types.ObjectId, auto: true }, 
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
    isVegan: { type: Boolean, default: false },
    isPromoted: { type: Boolean, default: false },
    imageUrl: String,
    inStock: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false }
);

export const ProductModel = model("products", productSchema);