import { Schema, model } from "mongoose";

const productSchema = new Schema(
  {
    name: {
      en: { type: String },
      ua: { type: String, required: true },
    },
    sku: { type: String, default: "" },
    volumeOptions: {
      type: [String],
      required: true,
    },
    priceByVolume: [
      {
        volume: { type: Number, required: true },
        price: { type: Number, required: true },
        stockQuantity: { type: Number, required: true, default: 0},
      },
    ],
   
    features: {
      en: { type: [String]},
      ua: { type: [String], required: true },
    },
    description: {
      en: { type: String },
      ua: { type: String },
    },
    instructions: {
      en: { type: String },
      ua: { type: String },
    },
    activeIngredients: [
      {
        name: {
          en: { type: String },
          ua: { type: String, required: true },
        },
        description: {
          en: { type: String },
          ua: { type: String },
        },
      },
    ],
    inciList: [String],
    category: {
      type: String,
      enum: ["hair", "face", "body", "makeup", "home"],
      default: "hair",
      required: true,
    },
    // reviews: {
    //   userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
    //   productId: {
    //     type: Schema.Types.ObjectId,
    //     ref: "products",
    //     required: true,
    //   },
    //   rating: { type: Number, required: true, min: 1, max: 5 },
    //   comment: { type: String, maxlength: 1000 },
    // },
    isVegan: { type: Boolean, default: false },
    isPromoted: { type: Boolean, default: false },
    imageUrl: String,
    inStock: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false }
);

productSchema.pre("save", function (next) {
  if (this.imageUrl && this.imageUrl.startsWith("http://")) {
    this.imageUrl = this.imageUrl.replace("http://", "https://");
  }
  next();
});

productSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update.imageUrl && update.imageUrl.startsWith("http://")) {
    update.imageUrl = update.imageUrl.replace("http://", "https://");
    this.setUpdate(update);
  }
  next();
});
  
export const ProductModel = model("Product", productSchema);
