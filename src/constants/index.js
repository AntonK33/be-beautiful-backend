import path from "node:path";
import { fileURLToPath } from "node:url";

export const SORT_VALUES = [];

export const SORT_ORDER = {
  ASC: "asc",
  DECS: "desc",
};

export const SWAGGER_PATH = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "..",
  "docs",
  "swagger.json"
);

export const INCOME_CATEGORIES = ["Incomes"];
export const EXPENSE_CATEGORIES = [
  "Main expenses",
  "Products",
  "Car",
  "Self care",
  "Child care",
  "Household products",
  "Education",
  "Leisure",
  "Other expenses",
  "Entertainment",
];

export const TEMP_UPLOAD_DIR = path.join(process.cwd(), 'temp');
export const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

export const CLOUDINARY = {
  CLOUD_NAME: 'CLOUD_NAME',
  API_KEY: 'API_KEY',
  API_SECRET: 'API_SECRET',
};