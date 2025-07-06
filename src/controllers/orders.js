import * as orderService from '../services/orders.js';
import createHttpError from 'http-errors';


export const createOrderController = async (req, res, next) => {
    try {
        const order = await orderService.createOrder(req.body);
        res.status(201).json({
            message: 'Order successfully created!',
            order,
        });
    } catch (err) {
        next(err);
    }
};

export const updateOrderController = async (req, res, next) => {
    try {
        const order = await orderService.updateOrder(req.params.id, req.body);
        res.json({
            message: 'Order is updated',
            data: order,
        });
    } catch (err) {
        next(err);
    }
};

export const deleteOrderController = async (req, res, next) => {
    try {
        await orderService.deleteOrder(req.params.id);
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};

export const reserveProductController = async (req, res, next) => {
    try {
        const result = await orderService.reserveProduct(req.body);
        res.json({
            message: 'Item reserved successfully',
            ...result,
        });
    } catch (err) {
        next(err);
    }
};

export const getLowStockProductsController = async (_req, res, next) => {
    try {
        const products = await orderService.getLowStockProducts();
        res.json(products);
    } catch (err) {
        next(createHttpError(500, 'Error getting low-stock products'));
    }
};