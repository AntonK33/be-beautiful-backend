import mongoose from 'mongoose';
import { CertificateModel } from '../db/models/certificateModel';
import 'dotenv/config.js';

const generateCertificates = async () => {
    try {
        await mongoose.connect(process.env.DB_HOST);
        console.log('✅ Connected to MongoDB');

        const denominations = [500, 1000, 1500, 2000];

        for (const amount of denominations) {
            for (let i = 1; i <= 20; i++) {
                const number = `SBB-${amount}-${String(i).padStart(3, '0')}`;
                await CertificateModel.create({ number, amount });
            }
        }

        console.log('🎉 Certificates created successfully!');
        await mongoose.disconnect();
    } catch (error) {
        console.error('❌ Error generating certificates:', error);
    }
};

generateCertificates();
