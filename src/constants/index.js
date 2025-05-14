import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const SORT_VALUES = [];

export const SORT_ORDER = {
  ASC: 'asc',
  DECS: 'desc',
};

export const FIFTEEN_MINUTES = 15 * 60 * 1000;

export const ONE_DAY = 24 * 60 * 60 * 1000;

export const SWAGGER_PATH = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
  'docs',
  'swagger.json',
);

export const INCOME_CATEGORIES = ['Incomes'];
export const EXPENSE_CATEGORIES = [
  'Main expenses',
  'Products',
  'Car',
  'Self care',
  'Child care',
  'Household products',
  'Education',
  'Leisure',
  'Other expenses',
  'Entertainment',
];
