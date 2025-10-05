import Joi from "joi";

export const createProductSchema = Joi.object({
  name: Joi.object({
    en: Joi.string().min(2).max(100).required(),
    ua: Joi.string().min(2).max(100).required(),
  }).required(),

  sku: Joi.string().allow("").optional(),

  volumeOptions: Joi.array().items(Joi.number().positive()).min(1).required(),

  priceByVolume: Joi.array()
    .items(
      Joi.object({
        volume: Joi.number().positive().required(),
        price: Joi.number().positive().required(),
      })
    )
    .min(1)
    .required(),

  stockQuantity: Joi.number().integer().min(0).required(),

  features: Joi.object({
    en: Joi.array().items(Joi.string()).min(1).required(),
    ua: Joi.array().items(Joi.string()).min(1).required(),
  }).required(),

  description: Joi.object({
    en: Joi.string().optional(),
    ua: Joi.string().optional(),
  }).optional(),

  instructions: Joi.object({
    en: Joi.string().optional(),
    ua: Joi.string().optional(),
  }).optional(),

  activeIngredients: Joi.array()
    .items(
      Joi.object({
        name: Joi.object({
          en: Joi.string().required(),
          ua: Joi.string().required(),
        }).required(),
        description: Joi.object({
          en: Joi.string().optional(),
          ua: Joi.string().optional(),
        }).optional(),
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
  name: Joi.object({
    en: Joi.string().min(2).max(100),
    ua: Joi.string().min(2).max(100),
  }),

  sku: Joi.string().allow(""),

  volumeOptions: Joi.array().items(Joi.number().positive()).min(1),

  priceByVolume: Joi.array().items(
    Joi.object({
      volume: Joi.number().positive().required(),
      price: Joi.number().positive().required(),
    })
  ),

  stockQuantity: Joi.number().integer().min(0),

  features: Joi.object({
    en: Joi.array().items(Joi.string()).min(1),
    ua: Joi.array().items(Joi.string()).min(1),
  }),

  description: Joi.object({
    en: Joi.string(),
    ua: Joi.string(),
  }),

  instructions: Joi.object({
    en: Joi.string(),
    ua: Joi.string(),
  }),

  activeIngredients: Joi.array().items(
    Joi.object({
      name: Joi.object({
        en: Joi.string().required(),
        ua: Joi.string().required(),
      }),
      description: Joi.object({
        en: Joi.string().optional(),
        ua: Joi.string().optional(),
      }),
    })
  ),

  inciList: Joi.array().items(Joi.string()),

  category: Joi.string().valid("hair", "face", "body", "makeup", "home"),

  isVegan: Joi.boolean(),
  imageUrl: Joi.string().uri(),
  inStock: Joi.boolean(),
}).min(1);

