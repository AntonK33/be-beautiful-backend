import { ProductModel } from "../db/models/products.js";

export const getProducts = async (filter = {}, page = 1, perPage = 10) => {
  const skip = (page - 1) * perPage;

  const [products, total] = await Promise.all([
    ProductModel.find(filter).skip(skip).limit(perPage),
    ProductModel.countDocuments(filter),
  ]);

  return {
    products,
    total,
    page,
    perPage,
    totalPages: Math.ceil(total / perPage),
  };
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
