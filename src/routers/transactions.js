import { Router } from 'express';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';

import { authenticate } from '../middlewares/authenticate.js';
import { isValidId } from '../middlewares/isValidId.js';

import {
  createTransactionController,
  deleteTransactionController,
  getTransactionsController,
  patchTransactionController,
} from '../controllers/transactions.js';

import {
  createTransactionSchema,
  patchTransactionSchema,
} from '../validation/transactions.js';
import { getStatisticsController } from '../controllers/statistics.js';

const router = Router();

router.use(authenticate);

router.get('/', ctrlWrapper(getTransactionsController));

router.post(
  '/',
  validateBody(createTransactionSchema),
  ctrlWrapper(createTransactionController),
);

router.patch(
  '/:transactionId',
  isValidId,
  validateBody(patchTransactionSchema),
  ctrlWrapper(patchTransactionController),
);

router.delete(
  '/:transactionId',
  isValidId,
  ctrlWrapper(deleteTransactionController),
);
router.get('/filter/by-date',
  ctrlWrapper(getStatisticsController));
export default router;
