import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { CertificateModel as Certificate } from './src/db/models/certificateModel.js';

dotenv.config();

const MONGO_URI = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_URL}/${process.env.MONGODB_DB}?retryWrites=true&w=majority`;

async function seed() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB');

        const certificates = [
            // 500
            ...Array.from({ length: 20 }, (_, i) => ({
                number: `SBB-500-${String(i + 1).padStart(3, '0')}`,
                amount: 500,
            })),

            // 1000
            ...Array.from({ length: 20 }, (_, i) => ({
                number: `SBB-1000-${String(i + 1).padStart(3, '0')}`,
                amount: 1000,
            })),

            // 1500
            ...Array.from({ length: 20 }, (_, i) => ({
                number: `SBB-1500-${String(i + 1).padStart(3, '0')}`,
                amount: 1500,
            })),

            // 2000
            ...Array.from({ length: 20 }, (_, i) => ({
                number: `SBB-2000-${String(i + 1).padStart(3, '0')}`,
                amount: 2000,
            })),
        ];

        for (const cert of certificates) {
            const exists = await Certificate.findOne({ number: cert.number });
            if (!exists) {
                await Certificate.create(cert);
                console.log(`➕ Added certificate: ${cert.number}`);
            } else {
                console.log(`⚠️ Certificate already exists: ${cert.number}`);
            }
        }

        await mongoose.disconnect();
        console.log('🔌 Disconnected from MongoDB');
    } catch (error) {
        console.error('❌ Error seeding certificates:', error);
    }
}

seed();
