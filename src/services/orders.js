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
    const {
        clientId,
        items,
        customerName,
        phone,
        email,
        comment,
        deliveryType,
        city,
        street,
        house,
        apartment,
        branchNumber,
        paymentMethod,
        certificateCode,
        certificateDiscount = 0,
    } = data;

    if (!clientId || !Array.isArray(items) || items.length === 0) {
        throw createHttpError(400, 'Items must be a non-empty array');
    }

    if (!deliveryType || !city) {
        throw createHttpError(400, 'Delivery type and city are required');
    }

    // === CONDITIONAL DELIVERY VALIDATION ===
    if (deliveryType === 'address') {
        if (!street || !house) {
            throw createHttpError(400, 'Street and house are required for address delivery');
        }
    }

    if (deliveryType === 'branch') {
        if (!branchNumber) {
            throw createHttpError(400, 'Branch number is required for branch delivery');
        }
    }

    let totalAmount = 0;
    let lowStockWarning = false;

    for (const item of items) {
        const product = await ProductModel.findById(item.product);

        if (!product) {
            throw createHttpError(404, `Product ${item.product} not found`);
        }

        const selectedVolume = Number(item.selectedVolume);

        const priceInfo = product.priceByVolume.find(
            (v) => v.volume === selectedVolume
        );

        if (!priceInfo) {
            throw createHttpError(
                400,
                `Volume ${selectedVolume} unavailable`
            );
        }

        if (priceInfo.stockQuantity < item.quantity) {
            throw createHttpError(
                400,
                `Not enough stock for volume ${selectedVolume}`
            );
        }

        if (priceInfo.stockQuantity - item.quantity < 5) {
            lowStockWarning = true;
        }

        // уменьшаем остаток
        priceInfo.stockQuantity -= item.quantity;
        await product.save();

        totalAmount += priceInfo.price * item.quantity;
    }

    // === CERTIFICATE LOGIC ===
    let finalAmount = totalAmount;

    if (certificateCode) {
        if (certificateDiscount <= 0) {
            throw createHttpError(400, 'Invalid certificate discount');
        }

        finalAmount = totalAmount - certificateDiscount;

        if (finalAmount < 0) {
            finalAmount = 0;
        }
    }

    // === PAYMENT LINK ===
    const paymentLink =
        paymentMethod === 'liqpay'
            ? `https://example.com/pay/${Date.now()}`
            : null;

    const newOrder = await OrderModel.create({
        clientId,
        customerName,
        phone,
        email,
        comment,
        deliveryMethod: 'nova_poshta',

        deliveryType,
        city,
        street,
        house,
        apartment,
        branchNumber,

        paymentMethod,
        paymentLink,

        certificateCode: certificateCode || null,
        certificateDiscount: certificateDiscount || 0,

        items,

        totalAmount,
        finalAmount,

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
export const reserveProduct = async ({ productId, selectedVolume, quantity }) => {
    const product = await ProductModel.findById(productId);

    const volume = Number(selectedVolume);
    const priceInfo = product.priceByVolume.find(v => v.volume === volume);

    if (!priceInfo) {
        throw createHttpError(400, 'Volume not found');
    }

    if (priceInfo.stockQuantity < quantity) {
        throw createHttpError(400, 'Not enough stock for reserve');
    }

    priceInfo.stockQuantity -= quantity;
    await product.save();

    return {
        productId: product._id,
        volume,
        remaining: priceInfo.stockQuantity,
    };
};

export const getLowStockProducts = async () => {
    return ProductModel.find({
        'priceByVolume.stockQuantity': { $lt: 5 }
    });
};