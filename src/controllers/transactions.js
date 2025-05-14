import createHttpError from 'http-errors';

import {
  deleteTransaction,
  getAllTransactions,
  patchTransaction,
  postTransaction,
} from '../services/transactions.js';

export const getTransactionsController = async (req, res) => {
  const userId = req.user._id;

  const data = await getAllTransactions(userId);

  res.status(200).json({
    status: 200,
    message: 'Successfully found transactions!',
    data,
  });
};

export const createTransactionController = async (req, res) => {
  const userId = req.user._id;

  const transaction = await postTransaction(req.body, userId);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a transaction!',
    data: transaction,
  });
};

export const patchTransactionController = async (req, res) => {
  const userId = req.user._id;
  const { transactionId } = req.params;

  const result = await patchTransaction(transactionId, req.body, userId);

  if (!result) throw createHttpError(404, 'Transaction not found');

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a transaction!',
    data: result.transaction,
  });
};

export const deleteTransactionController = async (req, res) => {
  const { transactionId } = req.params;
  const userId = req.user._id;

  const removedTransaction = await deleteTransaction(transactionId, userId);

  if (!removedTransaction) throw createHttpError(404, 'Transaction not found');

  res.status(204).send();
};
