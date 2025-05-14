import createHttpError from 'http-errors';
import { TransactionsCollection } from '../db/models/transaction.js';
import { UsersCollection } from '../db/models/user.js';

export const getAllTransactions = async (userId) => {
  const transactions = await TransactionsCollection.find({ userId });

  return {
    data: transactions,
  };
};

export const postTransaction = async (payload, userId) => {
  const userData = await UsersCollection.findById(userId);

  if (!userData) {
    throw createHttpError(404, 'Such user not found');
  }

  let updatedBalance;
  if (payload.type === '-') {
    updatedBalance = userData.balance - payload.summ;
  } else {
    updatedBalance = userData.balance + payload.summ;
  }

  await UsersCollection.findOneAndUpdate(
    { _id: userId },
    {
      balance: updatedBalance,
    },
  );

  return await TransactionsCollection.create({ ...payload, userId });
};

export const patchTransaction = async (id, payload, userId) => {
  if (payload.summ && typeof payload.summ === 'number') {
    const userData = await UsersCollection.findById(userId);
    const transactionData = await TransactionsCollection.findById(id);

    if (!userData || !transactionData) {
      throw createHttpError(404, 'Such user or transaction not found');
    }

    let updatedBalance;
    if (transactionData.type === '-') {
      updatedBalance = userData.balance + transactionData.summ - payload.summ;
    } else {
      updatedBalance = userData.balance - transactionData.summ + payload.summ;
    }

    await UsersCollection.findOneAndUpdate(
      { _id: userId },
      {
        balance: updatedBalance,
      },
    );
  }

  const rawResult = await TransactionsCollection.findOneAndUpdate(
    { _id: id, userId },
    payload,
    {
      new: true,
      includeResultMetadata: true,
    },
  );

  if (!rawResult || !rawResult.value) return null;

  return {
    transaction: rawResult.value,
  };
};

export const deleteTransaction = async (id, userId) => {
  const userData = await UsersCollection.findById(userId);
  const transactionData = await TransactionsCollection.findById(id);

  if (!userData || !transactionData) {
    throw createHttpError(404, 'Such user or transaction not found');
  }

  let updatedBalance;
  if (transactionData.type === '-') {
    updatedBalance = userData.balance + transactionData.summ;
  } else {
    updatedBalance = userData.balance - transactionData.summ;
  }

  await UsersCollection.findOneAndUpdate(
    { _id: userId },
    {
      balance: updatedBalance,
    },
  );

  return await TransactionsCollection.findOneAndDelete({ _id: id, userId });
};
