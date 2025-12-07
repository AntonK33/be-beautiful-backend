import { ProductModel } from "../db/models/products.js";

export const getProducts = async (filter = {}, page = 1, perPage = 10) => {
  const skip = (page - 1) * perPage;

  const aggregationPipeline = [
    { $match: filter },
    {
      $lookup: {
        from: "reviews",
        localField: "_id",
        foreignField: "productId",
        as: "reviews",
      },
    },
    { $skip: skip },
    { $limit: perPage },
  ];

  const [products, totalCount] = await Promise.all([
    ProductModel.aggregate(aggregationPipeline),
    ProductModel.countDocuments(filter),
  ]);

  return {
    products,
    total: totalCount,
    page,
    perPage,
    totalPages: Math.ceil(totalCount / perPage),
  };
};
export const getHomeProducts = async (categories, limit) => {
  const facet = {};

  for (const category of categories) {
    facet[category] = [
      { $match: { category } },
      { $sample: { size: limit } },
      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "productId",
          as: "reviews",
        },
      },
    ];
  }

  const result = await ProductModel.aggregate([{ $facet: facet }]);

  return result[0];
};

export const getProductById = async (id) => {
  const product = await ProductModel.findById(id).lean();
  console.log(product)
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
