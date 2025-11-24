import { Router } from 'express';
import {
    createCertificateController,
    getAllCertificatesController,
    getCertificateByIdController,
    getCertificateByNumberController,
    updateCertificateController,
    deleteCertificateController,
    activateCertificateController,
    spendCertificateController,
} from '../controllers/certificatesController.js';
import { checkCertificateMiddleware } from '../middlewares/checkCertificate.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';


const router = Router();


router.get('/', getAllCertificatesController);
router.get('/number/:number', getCertificateByNumberController);
router.get('/:id', getCertificateByIdController);

router.post('/', createCertificateController);
router.patch('/:id', updateCertificateController);
router.patch('/activate/:number', authMiddleware, activateCertificateController)
router.patch('/spend/:number', checkCertificateMiddleware, spendCertificateController);

router.delete('/:id', deleteCertificateController);


export default router;
