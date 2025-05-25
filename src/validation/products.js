import Joi from "joi";

export const createProductSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  sku: Joi.string().allow("").optional(),
  volumeOptions: Joi.array().items(Joi.string()).min(1).required(),
  priceByVolume: Joi.array()
    .items(
      Joi.object({
        volume: Joi.string().required(),
        price: Joi.number().positive().required(),
      })
    )
    .min(1)
    .required(),
  stockQuantity: Joi.number().integer().min(0).required(),
  features: Joi.array().items(Joi.string()).min(1).required(),
  description: Joi.string().optional(),
  instructions: Joi.string().optional(),
  activeIngredients: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required(),
        description: Joi.string().optional(),
      })
    )
    .optional(),
  inciList: Joi.array().items(Joi.string()).optional(),
  category: Joi.string()
    .valid("hair", "face", "body", "makeup", "home")
    .required(),
  isVegan: Joi.boolean().default(false),
  imageUrl: Joi.string().uri().optional(),
  inStock: Joi.boolean().default(true),
});

export const updateProductSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  sku: Joi.string().allow(""),
  volumeOptions: Joi.array().items(Joi.string()).min(1),
  priceByVolume: Joi.array().items(
    Joi.object({
      volume: Joi.string().required(),
      price: Joi.number().positive().required(),
    })
  ),
  stockQuantity: Joi.number().integer().min(0),
  features: Joi.array().items(Joi.string()).min(1),
  description: Joi.string(),
  instructions: Joi.string(),
  activeIngredients: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      description: Joi.string().optional(),
    })
  ),
  inciList: Joi.array().items(Joi.string()),
  category: Joi.string().valid("hair", "face", "body", "makeup", "home"),
  isVegan: Joi.boolean(),
  imageUrl: Joi.string().uri(),
  inStock: Joi.boolean(),
}).min(1);
