// src/schemas/orderSchemas.js
import Joi from 'joi';

export const orderSchema = Joi.object({
    clientId: Joi.string().required(),

    items: Joi.array()
        .items(
            Joi.object({
                product: Joi.string().required(),
                selectedVolume: Joi.string().required(),
                quantity: Joi.number().integer().min(1).required(),
            })
        )
        .min(1)
        .required(),
    
    customerName: Joi.string().required(),
    phone: Joi.string().required(),
    email: Joi.string().email().optional(),
    comment: Joi.string().allow('', null),
    // deliveryMethod: Joi.string().valid('nova_poshta', 'self_pickup').required(),
    
    totalAmount: Joi.number().optional(),
    paymentLink: Joi.string().optional(),
    lowStockWarning: Joi.boolean().optional(),
    status: Joi.string()
        .valid('draft', 'ordered', 'payed', 'done')
        .optional(),

});

export const reserveSchema = Joi.object({
    productId: Joi.string().required(),
    selectedVolume: Joi.string().required(),
    quantity: Joi.number().integer().min(1).required(),
});
