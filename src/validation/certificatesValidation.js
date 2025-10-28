import Joi from 'joi';

//
export const createCertificateSchema = Joi.object({
    number: Joi.string().trim().required().messages({
        'string.empty': 'Certificate number is required',
    }),
    amount: Joi.number().min(0).required().messages({
        'number.base': 'Amount must be a number',
        'number.min': 'Amount cannot be negative',
        'any.required': 'Amount is required',
    }),
    isActive: Joi.boolean().optional(),
    owner: Joi.string().allow(null, '').optional(),
});

//
export const updateCertificateSchema = Joi.object({
    amount: Joi.number().min(0).optional(),
    isActive: Joi.boolean().optional(),
    owner: Joi.string().allow(null, '').optional(),
});
