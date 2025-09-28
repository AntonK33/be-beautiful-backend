import createHttpError from 'http-errors';
import { OrderModel } from '../db/models/orderModel.js';
import { ProductModel } from '../db/models/products.js';

//get
export const getAllOrders = async () => {
    return OrderModel.find().populate('items.product').sort({ createdAt: -1 });
}

//get by id
export const getOrderById = async (id) => {
    const order = await OrderModel.findById(id).populate('items.product');
    if (!order) {
        throw createHttpError(404, 'Order not found');
    }
    return order;
};


//create
export const createOrder = async (data) => {
    const { clientId, items, customerName, phone, email, comment } = data;

    if (!clientId || !Array.isArray(items) || items.length === 0) {
        throw createHttpError(400, '⚠️ items is not an array');
    }

    let totalAmount = 0;
    let lowStockWarning = false;

    for (const item of items) {
        const product = await ProductModel.findById(item.product);
        if (!product) {
            throw createHttpError(404, `Product from id ${item.product} not found`);
        }

        const priceInfo = product.priceByVolume.find(v => v.volume === item.selectedVolume);
        if (!priceInfo) {
            throw createHttpError(400, `Volume "${item.selectedVolume}" unavailable for product "${product.name}"`);
        }

        const quantity = item.quantity;
        if (product.stockQuantity < quantity) {
            throw createHttpError(400, `There is not enough product "${product.name}" on the storage`);
        }

        if (product.stockQuantity - quantity < 5) {
            lowStockWarning = true;
        }

        product.stockQuantity -= quantity;
        await product.save();

        totalAmount += priceInfo.price * quantity;
    }

    const paymentLink = `https://example.com/pay/${Date.now()}`;

    const newOrder = await OrderModel.create({
        clientId,
        customerName,
        phone,
        email,
        comment,
        deliveryMethod: 'nova_poshta',
        items,
        totalAmount,
        paymentLink,
        lowStockWarning,
    });

    return newOrder;
};

//update
export const updateOrder = async (id, updates) => {
    const updatedOrder = await OrderModel.findByIdAndUpdate(
        id,
        updates,
        { new: true, runValidators: true }
    );

    if (!updatedOrder) {
        throw createHttpError(404, 'Order not found');
    }

    return updatedOrder;
};


//delete
export const deleteOrder = async (id) => {
    const deletedOrder = await OrderModel.findByIdAndDelete(id);
    if (!deletedOrder) {
        throw createHttpError(404, 'Order not found');
    }

    return deletedOrder;
};



//reserve
export const reserveProduct = async ({ productId, quantity }) => {
    if (!productId || !quantity) {
        throw createHttpError(400, 'ProductId and quantity required');
    }

    const product = await ProductModel.findById(productId);
    if (!product) {
        throw createHttpError(404, 'Product not found');
    }

    if (product.stockQuantity < quantity) {
        throw createHttpError(400, 'Not enough stock for reserve');
    }

    product.stockQuantity -= quantity;
    await product.save();

    return {
        productId: product._id,
        remaining: product.stockQuantity,
    };
};

export const getLowStockProducts = async () => {
    return ProductModel.find({ stockQuantity: { $lt: 5 } });
};
