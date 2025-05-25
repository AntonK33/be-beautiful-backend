import { ProductModel } from "../db/models/products.js";

export const getProducts = async () => {
  const products = await ProductModel.find();
  return products;
};

export const getProductById = async (id) => {
  const product = await ProductModel.findById(id);
  return product;
};

export const createProduct = async (payload) => {
  return await ProductModel.create(payload);
};

export const updateProduct = async (id, payload, options = {}) => {
  const updatedProduct = await ProductModel.findOneAndUpdate(
    { _id: id },
    payload,
    {
      new: true,
      runValidators: true,
      omitUndefined: true,
      ...options,
    }
  );

  return updatedProduct;
};

export const deleteProduct = async (id) => {
  return await ProductModel.findOneAndDelete({ _id: id });
};
