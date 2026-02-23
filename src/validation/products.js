import Joi from "joi";

export const createProductSchema = Joi.object({
  name: Joi.object({
    en: Joi.string().min(2).max(100).optional(),
    ua: Joi.string().min(2).max(100).required(),
  }).required(),

  sku: Joi.string().allow("").optional(),

  volumeOptions: Joi.array()
    .items(Joi.number().positive())
    .min(1)
    .required(),

  priceByVolume: Joi.array()
    .items(
      Joi.object({
        volume: Joi.number().positive().required(),
        price: Joi.number().positive().required(),
        stockQuantity: Joi.number().integer().min(0).required(),
      })
    )
    .min(1)
    .required(),

  features: Joi.object({
    en: Joi.array().items(Joi.string()).optional(),
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
          en: Joi.string().optional(),
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
  isPromoted: Joi.boolean().default(false),

  imageUrl: Joi.string().uri().optional(),
  inStock: Joi.boolean().optional(),
});

export const updateProductSchema = Joi.object({
  name: Joi.object({
    en: Joi.string().min(2).max(100).optional(),
    ua: Joi.string().min(2).max(100).optional(),
  }),

  sku: Joi.string().allow(""),

  volumeOptions: Joi.array().items(Joi.number().positive()).min(1),

  priceByVolume: Joi.array().items(
    Joi.object({
      volume: Joi.number().positive().required(),
      price: Joi.number().positive().required(),
      stockQuantity: Joi.number().integer().min(0).required(),
    })
  ),

  features: Joi.object({
    en: Joi.array().items(Joi.string()).optional(),
    ua: Joi.array().items(Joi.string()).optional(),
  }),

  description: Joi.object({
    en: Joi.string().optional(),
    ua: Joi.string().optional(),
  }),

  instructions: Joi.object({
    en: Joi.string().optional(),
    ua: Joi.string().optional(),
  }),

  activeIngredients: Joi.array().items(
    Joi.object({
      name: Joi.object({
        en: Joi.string().optional(),
        ua: Joi.string().required(),
      }).required(),
      description: Joi.object({
        en: Joi.string().optional(),
        ua: Joi.string().optional(),
      }),
    })
  ),

  inciList: Joi.array().items(Joi.string()),

  category: Joi.string().valid("hair", "face", "body", "makeup", "home"),

  isVegan: Joi.boolean(),
  isPromoted: Joi.boolean(),

  imageUrl: Joi.string().uri(),
  inStock: Joi.boolean(),
}).min(1);