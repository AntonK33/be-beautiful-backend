import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/products.js";
import createHttpError from "http-errors";

export const getProductsController = async (req, res, next) => {
  const products = await getProducts();
  res.status(200).json({
    status: 200,
    message: "Successfully found products!",
    data: products,
  });
};

export const getProductByIdController = async (req, res, next) => {
  const { productId } = req.params;
  const product = await getProductById(productId);

  if (!product) {
    return next(createHttpError(404, "Product not found"));
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found product with id ${productId}!`,
    data: product,
  });
};

export const createProductController = async (req, res, next) => {
  const product = await createProduct(req.body);

  res.status(201).json({
    status: 201,
    message: "Successfully created a product!",
    data: product,
  });
};

export const patchProductController = async (req, res, next) => {
  const { productId } = req.params;
  const result = await updateProduct(productId, req.body);

  if (!result) {
    return next(createHttpError(404, "Product not found"));
  }

  res.json({
    message: "Successfully patched a product!",
    data: result,
  });
};

export const deleteProductController = async (req, res, next) => {
  const { productId } = req.params;
  const product = await deleteProduct(productId);

  if (!product) {
    return next(createHttpError(404, "Product not found"));
  }

  res.status(204).send();
};
