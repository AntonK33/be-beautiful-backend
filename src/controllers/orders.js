// 📁 controllers/orders.js
import createHttpError from 'http-errors';
import { OrderModel } from '../db/models/OrderModel.js';
import { ProductModel } from '../db/models/products.js';


//create
export const createOrderController = async (req, res, next) => {
    try {
        const { clientId, items, customerName, phone, email, comment, deliveryMethod } = req.body;

        if (!clientId || !Array.isArray(items) || items.length === 0) {
            return next(createHttpError(400, 'Incorrect order: missing products or customer ID'));
        }

        let totalAmount = 0;
        let lowStockWarning = false;

        for (const item of items) {
            const product = await ProductModel.findById(item.product);
            if (!product) {
                return next(createHttpError(404, `product from id ${item.product} not found`));
            }

            const priceInfo = product.priceByVolume.find(v => v.volume === item.selectedVolume);
            if (!priceInfo) {
                return next(createHttpError(400, `Volume "${item.selectedVolume}" unavailable for product "${product.name}"`));
            }

            const quantity = item.quantity;
            if (product.stockQuantity < quantity) {
                return next(createHttpError(400, `There is not enough product "${product.name}" on the storage`));
            }

            if (product.stockQuantity - quantity < 5) {
                lowStockWarning = true;
            }

            product.stockQuantity -= quantity;
            await product.save();

            totalAmount += priceInfo.price * quantity;
        }

        const paymentLink = `https://example.com/pay/${Date.now()}`; //example

        const newOrder = await OrderModel.create({
            clientId,
            customerName,
            phone,
            email,
            comment,
            deliveryMethod,
            items,
            totalAmount,
            paymentLink,
            lowStockWarning,
        });

        res.status(201).json({
            message: 'Order successfully created!',
            order: newOrder,
        });

    } catch (err) {
        next(createHttpError(500, 'Server error when creating order'));
    }
};

//update
export const updateOrderController = async (req, res, next) => {
    try {
        const updatedOrder = await OrderModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedOrder) {
            return next(createHttpError(404, 'Order not found'));
        }

        res.json({
            message: 'Order is update',
            data: updatedOrder,
        });
    } catch (err) {
        next(createHttpError(500, 'Error updating order'));
    }
};

//delete
export const deleteOrderController = async (req, res, next) => {
    try {
        const deletedOrder = await OrderModel.findByIdAndDelete(req.params.id);

        if (!deletedOrder) {
            return next(createHttpError(404, 'Order not found'));
        }

        res.status(204).send();
    } catch (err) {
        next(createHttpError(500, 'Error deleting order'));
    }
};

//reserve
export const reserveProductController = async (req, res, next) => {
    try {
        const { productId, selectedVolume, quantity } = req.body;

        if (!productId || !quantity) {
            return next(createHttpError(400, 'ProductId and quantity required'));
        }

        const product = await ProductModel.findById(productId);
        if (!product) {
            return next(createHttpError(404, 'Product not found'));
        }

        if (product.stockQuantity < quantity) {
            return next(createHttpError(400, 'Not enough stock for reserve'));
        }

        product.stockQuantity -= quantity;
        await product.save();

        res.json({
            message: 'Item reserved successfully',
            productId: product._id,
            remaining: product.stockQuantity,
        });

    } catch (err) {
        next(createHttpError(500, 'Error while reserving the product'));
    }
};


//if 5
export const getLowStockProductsController = async (_req, res) => {
    const products = await ProductModel.find({ stockQuantity: { $lt: 5 } });
    res.json(products);
};
