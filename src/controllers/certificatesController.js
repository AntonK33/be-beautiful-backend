import * as certificateService from '../services/certificatesService.js';
import {
    createCertificateSchema,
    updateCertificateSchema,
} from '../validation/certificatesValidation.js';

// ===================== GET ALL =====================
export const getAllCertificatesController = async (req, res, next) => {
    try {
        const data = await certificateService.getAllCertificates();
        res.json(data);
    } catch (error) {
        next(error);
    }
};

// ===================== GET BY ID =====================
export const getCertificateByIdController = async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = await certificateService.getCertificateById(id);
        res.json(data);
    } catch (error) {
        next(error);
    }
};

// ===================== GET BY NUMBER =====================
export const getCertificateByNumberController = async (req, res, next) => {
    try {
        const { number } = req.params;
        const data = await certificateService.getCertificateByNumber(number);
        res.json(data);
    } catch (error) {
        next(error);
    }
};

// ===================== CREATE =====================
export const createCertificateController = async (req, res, next) => {
    try {
        const { error } = createCertificateSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const newCertificate = await certificateService.createCertificate(req.body);
        res.status(201).json(newCertificate);
    } catch (error) {
        next(error);
    }
};

// ===================== UPDATE =====================
export const updateCertificateController = async (req, res, next) => {
    try {
        const { error } = updateCertificateSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const { id } = req.params;
        const updated = await certificateService.updateCertificate(id, req.body);
        res.json(updated);
    } catch (error) {
        next(error);
    }
};

// ===================== DELETE =====================
export const deleteCertificateController = async (req, res, next) => {
    try {
        const { id } = req.params;
        await certificateService.deleteCertificate(id);
        res.json({ message: 'Certificate deleted successfully' });
    } catch (error) {
        next(error);
    }
};

// ===================== ACTIVATE CERTIFICATE =====================
export const activateCertificateController = async (req, res, next) => {
    try {
        const { number } = req.params;
        const { owner } = req.body;        // client
        const adminId = req.user.id;       //from activity

        if (!owner) {
            return res.status(400).json({ message: 'Owner is required' });
        }

        const activated = await certificateService.activateCertificate(
            number,
            { owner, adminId }
        );

        res.json(activated);
    } catch (error) {
        next(error);
    }
};


// ===================== SPEND =====================
export const spendCertificateController = async (req, res, next) => {
    try {
        const { number } = req.params;
        const { amount } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ message: 'Amount to spend must be greater than 0' });
        }

        const updatedCertificate = await certificateService.spendCertificateAmount(number, amount);
        res.json(updatedCertificate);
    } catch (error) {
        next(error);
    }
};
