import mongoose from 'mongoose';
import { ProductModel } from '../db/models/products.js';
import 'dotenv/config.js';

const checkProducts = async () => {
    try {
        const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_URL}/${process.env.MONGODB_DB}?retryWrites=true&w=majority`;
        await mongoose.connect(uri);

        const products = await ProductModel.find();
        for (const product of products) {
            console.log(`Product: ${product.name.en} (ID: ${product._id})`);
            product.priceByVolume.forEach((p) => {
                console.log(`  Volume: ${p.volume} => stockQuantity: ${p.stockQuantity}`);
            });
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
};

checkProducts();
