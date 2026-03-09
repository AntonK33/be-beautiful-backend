import Joi from 'joi';

export const orderSchema = Joi.object({
    clientId: Joi.string().allow(null).optional(),

    items: Joi.array()
        .items(
            Joi.object({
                product: Joi.string().required(),
                selectedVolume: Joi.number().required(),
                quantity: Joi.number().integer().min(1).required(),
            })
        )
        .min(1)
        .required(),

    deliveryType: Joi.string().valid('address', 'branch').required(),
    city: Joi.string().required(),

    street: Joi.when('deliveryType', {
        is: 'address',
        then: Joi.required(),
        otherwise: Joi.optional(),
    }),

    house: Joi.when('deliveryType', {
        is: 'address',
        then: Joi.required(),
        otherwise: Joi.optional(),
    }),

    apartment: Joi.optional(),

    branchNumber: Joi.when('deliveryType', {
        is: 'branch',
        then: Joi.required(),
        otherwise: Joi.optional(),
    }),
    branchName: Joi.string().allow('', null),

    paymentMethod: Joi.string()
        .valid('liqpay', 'requisites', 'cod')
        .required(),

    customerName: Joi.string().required(),
    phone: Joi.string().required(),
    email: Joi.string().email().optional(),

    comment: Joi.string().allow('', null).optional(),
    certificateCode: Joi.string().optional(),
    certificateDiscount: Joi.number().min(0).optional(),

    status: Joi.string()
        .valid('draft', 'ordered', 'payed', 'done')
        .optional(),
});

export const reserveSchema = Joi.object({
    productId: Joi.string().required(),
    selectedVolume: Joi.number().required(),
    quantity: Joi.number().integer().min(1).required(),
});