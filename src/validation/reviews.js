import Joi from "joi";

export const createReviewSchema = Joi.object({
  productId: Joi.string().hex().length(24).required(),
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().max(1000).allow("", null).optional(),
});

export const updateReviewSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5).optional(),
  comment: Joi.string().max(1000).allow("", null).optional(),
}).min(1); // At least one field must be provided for update
