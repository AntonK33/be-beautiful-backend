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


const router = Router();


router.get('/', getAllCertificatesController);
router.get('/:id', getCertificateByIdController);
router.get('/number/:number', getCertificateByNumberController);

router.post('/', createCertificateController);
router.patch('/:id', updateCertificateController);
router.patch('/activate/:number', activateCertificateController);
router.patch('/spend/:number', spendCertificateController);

router.delete('/:id', deleteCertificateController);


export default router;
