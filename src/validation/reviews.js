import Joi from "joi";

export const reviewSchema = Joi.object({
  productId: Joi.string().required(),
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().max(1000).allow("", null),
});
