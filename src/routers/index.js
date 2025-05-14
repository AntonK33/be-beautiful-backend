import express from 'express';

import authRouter from './auth.js';
import transactionsRouter from './transactions.js';


import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../constants/index.js';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/transactions', transactionsRouter);


export default router;
