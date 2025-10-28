import createHttpError from 'http-errors';
import { CertificateModel } from '../db/models/certificateModel.js';


// ===================== GET ALL =====================
export const getAllCertificates = async () => {
    return CertificateModel.find().sort({ createdAt: -1 });
};

// ===================== GET BY ID =====================
export const getCertificateById = async (id) => {
    const certificate = await CertificateModel.findById(id);
    if (!certificate) throw createHttpError(404, 'Certificate not found');
    return certificate;
};

// ===================== GET BY NUMBER =====================
export const getCertificateByNumber = async (number) => {
    const certificate = await CertificateModel.findOne({ number });
    if (!certificate) throw createHttpError(404, 'Certificate not found');
    return certificate;
};

// ===================== CREATE =====================
export const createCertificate = async (data) => {
    const { number } = data;

    const existing = await CertificateModel.findOne({ number });
    if (existing) throw createHttpError(400, 'Certificate with this number already exists');

    const newCertificate = await CertificateModel.create(data);
    return newCertificate;
};

// ===================== UPDATE =====================
export const updateCertificate = async (id, updates) => {
    const updated = await CertificateModel.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
    });

    if (!updated) throw createHttpError(404, 'Certificate not found');

    return updated;
};

// ===================== DELETE =====================
export const deleteCertificate = async (id) => {
    const deleted = await CertificateModel.findByIdAndDelete(id);
    if (!deleted) throw createHttpError(404, 'Certificate not found');
    return deleted;
};

// ===================== ACTIVATE CERTIFICATE =====================
export const activateCertificate = async (number, userId) => {
    const certificate = await CertificateModel.findOne({ number });
    if (!certificate) throw createHttpError(404, 'Certificate not found');

    if (certificate.isActive) {
        throw createHttpError(400, 'Certificate is already active');
    }

    const now = new Date();
    const expiresAt = new Date(now);
    expiresAt.setMonth(now.getMonth() + 6);

    certificate.isActive = true;
    certificate.owner = userId;
    certificate.activatedAt = now;
    certificate.expiresAt = expiresAt;
    certificate.activatedBy = userId;

    await certificate.save();

    return certificate;
};

// ===================== SPEND CERTIFICATE =====================
export const spendCertificateAmount = async (number, amountToSpend) => {
    const cert = await CertificateModel.findOne({ number });
    if (!cert) throw createHttpError(404, 'Certificate not found');
    if (!cert.isActive) throw createHttpError(400, 'Certificate not active');

    if (cert.balance < amountToSpend)
        throw createHttpError(400, 'Not enough balance');

    cert.balance -= amountToSpend;

    if (cert.balance === 0) {
        cert.isActive = false;
    }

    await cert.save();
    return cert;
};
