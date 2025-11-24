import { CertificateModel } from '../db/models/certificateModel.js';

export const checkCertificateMiddleware = async (req, res, next) => {
    try {
        const { certificateNumber, orderTotal } = req.body;

        if (!certificateNumber) {
            return next();
        }

        const certificate = await CertificateModel.findOne({ number: certificateNumber });

        if (!certificate) {
            return res.status(404).json({ message: 'Certificate not found' });
        }

        if (!certificate.isActive) {
            return res.status(400).json({ message: 'Certificate is not active' });
        }

        if (certificate.balance < orderTotal) {
            return res.status(400).json({ message: 'Not enough balance on certificate' });
        }

        req.certificate = certificate;

        next();

    } catch (error) {
        next(error);
    }
};
