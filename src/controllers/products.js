import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getHomeProducts
} from "../services/products.js";
import createHttpError from "http-errors";
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import { saveFileToUploadDir } from "../utils/saveFileToUploadDir.js";

export const getProductsController = async (req, res, next) => {
  try {
    const {
      category,
      isVegan,
      isPromoted,
      page = 1,
      perPage = 10,
      volumeOptions,
      keyword,
    } = req.query;

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

    if (volumeOptions) {
      const volumes = volumeOptions
        .split(",")
        .map((v) => Number(v.trim()))
        .filter((v) => !isNaN(v));

      if (volumes.length > 0) {
        filter.volumeOptions = { $in: volumes };
      }
    }

    if (keyword) {
      filter.name = { $regex: keyword, $options: "i" };
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
export const getHomeProductsController = async (req, res, next) => {
  try {
    const limit = Number(req.query.limit) || 4; 
    const categories = ["face", "hair", "body", "makeup", "home"];

    const data = await getHomeProducts(categories, limit);

    res.status(200).json({
      status: 200,
      message: "Successfully loaded home page products",
      data,
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


export const createProductController = async (req, res, next) => {
  try {
    const file = req.file;
    let photoUrl;

    if (file) {
      if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
        photoUrl = await saveFileToCloudinary(file);
      } else {
        photoUrl = await saveFileToUploadDir(file);
      }
    }

    const safeParse = (value) => {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    };

    const body = {
      ...req.body,
      name: safeParse(req.body.name),
      sku: safeParse(req.body.sku),
      volumeOptions: safeParse(req.body.volumeOptions),
      priceByVolume: safeParse(req.body.priceByVolume),
      features: safeParse(req.body.features),
      description: safeParse(req.body.description),
      instructions: safeParse(req.body.instructions),
      activeIngredients: safeParse(req.body.activeIngredients),
      inciList: safeParse(req.body.inciList),
      isVegan: req.body.isVegan === 'true',
      isPromoted: req.body.isPromoted === 'true',
      inStock: req.body.inStock === 'true',
      stockQuantity: Number(req.body.stockQuantity),
      ...(photoUrl && { imageUrl: photoUrl }),
    };
    
    const product = await createProduct(body);

    res.status(201).json({
      status: 201,
      message: "Successfully created a product!",
      data: product,
    });
  } catch (err) {
    console.error("Create Product Error:", err); // <-- добавляем полный лог ошибки
    next(err);
  }
};

export const patchProductController = async (req, res, next) => {
  const { productId } = req.params;
  const file = req.file;
    let photoUrl;

    if (file) {
      if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
        photoUrl = await saveFileToCloudinary(file);
      } else {
        photoUrl = await saveFileToUploadDir(file);
      }
    }

    const safeParse = (value) => {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    };

    const body = {
      ...req.body,
      name: safeParse(req.body.name),
      sku: safeParse(req.body.sku),
      volumeOptions: safeParse(req.body.volumeOptions),
      priceByVolume: safeParse(req.body.priceByVolume),
      features: safeParse(req.body.features),
      description: safeParse(req.body.description),
      instructions: safeParse(req.body.instructions),
      activeIngredients: safeParse(req.body.activeIngredients),
      inciList: safeParse(req.body.inciList),
      isVegan: req.body.isVegan === 'true',
      isPromoted: req.body.isPromoted === 'true',
      inStock: req.body.inStock === 'true',
      stockQuantity: Number(req.body.stockQuantity),
      ...(photoUrl && { imageUrl: photoUrl }),
    };
  const result = await updateProduct(productId, body);

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
