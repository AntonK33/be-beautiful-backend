import Joi from "joi";

export const registerUserSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    .messages({
      "string.pattern.base": "Please enter a valid email address",
      "any.required": "email is required",
    }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password should be at least 6 characters long",
    "any.required": "Password is required",
  }),
  language: Joi.string().valid("en", "uk").optional(),
});
