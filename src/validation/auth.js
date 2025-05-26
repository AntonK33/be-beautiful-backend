import Joi from "joi";

export const registerUserSchema = Joi.object({
  name: Joi.string().required(),
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
  role: Joi.string().valid("user", "admin").optional(),
});

export const loginUserSchema = Joi.object({
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

export const updateCurrentUserSchema = Joi.object({
  name: Joi.string().allow("").messages({
    "string.base": "Username should be a string",
  }),
  email: Joi.string()
    .email()
    .pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    .messages({
      "string.pattern.base": "Please enter a valid email address",
      "any.required": "email is required",
    }),
  gender: Joi.string().valid("woman", "man"),
  // avatarUrlCloudinary: Joi.string(),
  // avatarUrlLocal: Joi.string(),
  language: Joi.string().valid("en", "uk"),
});
