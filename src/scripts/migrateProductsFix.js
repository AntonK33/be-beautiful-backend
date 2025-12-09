import mongoose from 'mongoose';
import { ProductModel } from '../db/models/products.js';
import 'dotenv/config.js';

const migrateProductsFix = async () => {
    try {
        const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_URL}/${process.env.MONGODB_DB}?retryWrites=true&w=majority`;
        console.log('Connecting to MongoDB:', uri);
        await mongoose.connect(uri);
        console.log('✅ Connected to MongoDB');

        const products = await ProductModel.find();
        let modifiedCount = 0;

        for (const product of products) {
            let changed = false;
            const doc = product.toObject();

            if (!doc.name || typeof doc.name === 'string') {
                const oldName = typeof doc.name === 'string' ? doc.name : '';
                doc.name = { en: oldName || 'Default Name EN', ua: oldName || 'Default Name UA' };
                changed = true;
            } else {
                if (!doc.name.en) {
                    doc.name.en = 'Default Name EN';
                    changed = true;
                }
                if (!doc.name.ua) {
                    doc.name.ua = 'Default Name UA';
                    changed = true;
                }
            }

            if (!doc.priceByVolume || doc.priceByVolume.length === 0) {
                doc.priceByVolume = [
                    { volume: 250, price: 100, stockQuantity: 100 },
                    { volume: 500, price: 180, stockQuantity: 100 },
                ];
                changed = true;
            } else {
                doc.priceByVolume = doc.priceByVolume.map((v, idx) => {
                    if (!v.volume) {
                        changed = true;
                        return { ...v, volume: [250, 500, 1000][idx] || 250 };
                    }
                    return v;
                });
            }

            if (doc.activeIngredients?.length) {
                doc.activeIngredients = doc.activeIngredients.map((ing, idx) => {
                    if (!ing.name || typeof ing.name === 'string') {
                        const oldIngName = typeof ing.name === 'string' ? ing.name : '';
                        changed = true;
                        return {
                            ...ing,
                            name: {
                                en: oldIngName || `Default Ingredient EN ${idx + 1}`,
                                ua: oldIngName || `Default Ingredient UA ${idx + 1}`,
                            },
                        };
                    } else {
                        if (!ing.name.en) {
                            ing.name.en = `Default Ingredient EN ${idx + 1}`;
                            changed = true;
                        }
                        if (!ing.name.ua) {
                            ing.name.ua = `Default Ingredient UA ${idx + 1}`;
                            changed = true;
                        }
                        return ing;
                    }
                });
            }

            if (changed) {

                await ProductModel.updateOne({ _id: product._id }, doc);
                modifiedCount++;
            }
        }

        console.log(`🎉 Migration done. Modified: ${modifiedCount}`);
        await mongoose.disconnect();
        console.log('✅ Disconnected from MongoDB');
    } catch (err) {
        console.error('❌ Migration error:', err);
    }
};

migrateProductsFix();
