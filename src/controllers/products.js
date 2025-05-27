import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/products.js";
import createHttpError from "http-errors";

export const getProductsController = async (req, res, next) => {
  try {
    const { category, isVegan, isPromoted, page = 1, perPage = 10 } = req.query;

    const allowedCategories = ["face", "hair", "body", "makeup", "home"];
    const filter = {};

    if (category) {
      const categories = category
        .split(",")
        .map((cat) => cat.trim().toLowerCase());

      const validCategories = categories.filter((cat) =>
        allowedCategories.includes(cat)
      );

      if (validCategories.length > 0) {
        filter.category = { $in: validCategories };
      }
    }

    if (isVegan !== undefined) {
      filter.isVegan = isVegan === "true";
    }

    if (isPromoted !== undefined) {
      filter.isPromoted = isPromoted === "true";
    }

    const pagination = {
      page: Number(page),
      perPage: Number(perPage),
    };

    const result = await getProducts(
      filter,
      pagination.page,
      pagination.perPage
    );

    if (!result.products || result.products.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "No products found.",
        data: [],
      });
    }

    return res.status(200).json({
      status: 200,
      message: "Successfully found products!",
      data: result.products,
      pagination: {
        total: result.total,
        page: result.page,
        perPage: result.perPage,
        totalPages: result.totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
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

export const createProductController = async (req, res, ) => {
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
