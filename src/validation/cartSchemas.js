import Joi from 'joi';

export const cartItemsSchema = Joi.object({
    items: Joi.array()
        .items(
            Joi.object({
                productId: Joi.string().required(),
                quantity: Joi.number().integer().min(1).required(),
            })
        )
        .min(1)
        .required(),
    address: Joi.string().optional(),
});
