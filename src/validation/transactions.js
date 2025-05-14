import Joi from 'joi';

export const createTransactionSchema = Joi.object({
  type: Joi.string().valid('-', '+').required().messages({
    'string.base': 'Type should be a string',
    'any.only': 'Type must be either - or +',
    'any.required': 'Type is required',
  }),
  category: Joi.string()
    .valid(
      'Main expenses',
      'Products',
      'Car',
      'Self care',
      'Child care',
      'Household products',
      'Education',
      'Leisure',
      'Other expenses',
      'Entertainment',
      'Income',
    )
    .required()
    .messages({
      'string.base': 'Category should be a string',
      'any.only': 'Category must be one of the predefined values',
      'any.required': 'Category is required',
    }),
  date: Joi.date().required().messages({
    'any.required': 'Date is required',
  }),
  summ: Joi.number().required().messages({
    'number.base': 'Summ should be a number',
    'any.required': 'Summ is required',
  }),
  comment: Joi.string().allow('').messages({
    'string.base': 'Comment should be a string',
  }),
});

export const patchTransactionSchema = Joi.object({
  type: Joi.string().valid('-', '+').messages({
    'string.base': 'Type should be a string',
    'any.only': 'Type must be either - or +',
  }),
  category: Joi.string()
    .valid(
      'Main expenses',
      'Products',
      'Car',
      'Self care',
      'Child care',
      'Household products',
      'Education',
      'Leisure',
      'Other expenses',
      'Entertainment',
      'Income',
    )
    .messages({
      'string.base': 'Category should be a string',
      'any.only': 'Category must be one of the predefined values',
    }),
  date: Joi.date(),
  summ: Joi.number().messages({
    'number.base': 'Summ should be a number',
    'any.required': 'Summ is required',
  }),
  comment: Joi.string().allow('').messages({
    'string.base': 'Comment should be a string',
  }),
});
