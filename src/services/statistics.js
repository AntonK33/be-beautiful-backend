import { TransactionsCollection } from '../db/models/transaction.js';

export const getStatisticsSercices = async (userId, start, end) => {
  const startDate = new Date(`${start}T00:00:00.000Z`);
  const endDate = new Date(`${end}T23:59:59.999Z`);

  const transactions = await TransactionsCollection.find({
    userId,
    date: {
      $gte: startDate,
      $lte: endDate,
    },
  });
  return {
    data: transactions,
  };
};
