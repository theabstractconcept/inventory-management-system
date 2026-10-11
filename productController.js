const mongoose = require("mongoose");
const Product = require("../models/producttemp");

// ==========================================
// 1. CREATE A SINGLE PRODUCT
// ==========================================
exports.createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      message: "Product created successfully",
      product
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 2. CREATE MULTIPLE PRODUCTS
// ==========================================
exports.createManyProducts = async (req, res, next) => {
  try {
    const { products } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        message: "Provide a non-empty products array"
      });
    }

    if (products.length > 100) {
      return res.status(400).json({
        message: "Maximum 100 products per request"
      });
    }

    const createdProducts = await Product.insertMany(products);

    res.status(201).json({
      message: "Products created successfully",
      count: createdProducts.length,
      products: createdProducts
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 3. GET ALL PRODUCTS
// Supports filtering, sorting and pagination
// ==========================================
exports.getAllProducts = async (req, res, next) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      sortBy = "createdAt",
      order = "desc",
      page = 1,
      limit = 10,
      search
    } = req.query;

    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};

      if (minPrice !== undefined) {
        filter.price.$gte = Number(minPrice);
      }

      if (maxPrice !== undefined) {
        filter.price.$lte = Number(maxPrice);
      }
    }

    if (search) {
      filter.name = {
        $regex: search,
        $options: "i"
      };
    }

    const pageNumber = Math.max(1, parseInt(page, 10) || 1);
    const pageSize = Math.min(
      100,
      Math.max(1, parseInt(limit, 10) || 10)
    );

    const allowedSortFields = [
      "name",
      "price",
      "stock",
      "createdAt"
    ];

    const sortField = allowedSortFields.includes(sortBy)
      ? sortBy
      : "createdAt";

    const sortOrder = order === "asc" ? 1 : -1;

    const products = await Product.find(filter)
      .sort({ [sortField]: sortOrder })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    const totalProducts = await Product.countDocuments(filter);

    res.status(200).json({
      totalProducts,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalProducts / pageSize),
      products
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 4. GET A SINGLE PRODUCT BY ID
// ==========================================
exports.getProductById = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid product ID"
      });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 5. UPDATE A PRODUCT
// ==========================================
exports.updateProduct = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid product ID"
      });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.status(200).json({
      message: "Product updated successfully",
      product
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 6. RESTOCK A PRODUCT
// ==========================================
exports.restockProduct = async (req, res, next) => {
  try {
    const { quantity } = req.body;

    if (
      !Number.isInteger(quantity) ||
      quantity <= 0
    ) {
      return res.status(400).json({
        message: "Quantity must be a positive integer"
      });
    }

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid product ID"
      });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $inc: { stock: quantity } },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.status(200).json({
      message: "Product restocked successfully",
      product
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 7. SELL A PRODUCT
// Prevents stock from becoming negative
// ==========================================
exports.sellProduct = async (req, res, next) => {
  try {
    const { quantity } = req.body;

    if (
      !Number.isInteger(quantity) ||
      quantity <= 0
    ) {
      return res.status(400).json({
        message: "Quantity must be a positive integer"
      });
    }

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid product ID"
      });
    }

    const product = await Product.findOneAndUpdate(
      {
        _id: req.params.id,
        stock: { $gte: quantity }
      },
      {
        $inc: { stock: -quantity }
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!product) {
      const exists = await Product.exists({
        _id: req.params.id
      });

      if (!exists) {
        return res.status(404).json({
          message: "Product not found"
        });
      }

      return res.status(400).json({
        message: "Insufficient stock"
      });
    }

    res.status(200).json({
      message: "Sale completed successfully",
      product
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 8. DELETE A PRODUCT
// ==========================================
exports.deleteProduct = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid product ID"
      });
    }

    const product = await Product.findByIdAndDelete(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.status(200).json({
      message: "Product deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 9. LOW-STOCK REPORT
// ==========================================
exports.getLowStockReport = async (req, res, next) => {
  try {
    const threshold = Number(req.query.threshold ?? 5);

    if (!Number.isFinite(threshold) || threshold < 0) {
      return res.status(400).json({
        message: "Threshold must be a non-negative number"
      });
    }

    const products = await Product.find({
      stock: { $lte: threshold }
    }).sort({ stock: 1 });

    res.status(200).json({
      threshold,
      count: products.length,
      products
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 10. CATEGORY-WISE SUMMARY
// ==========================================
exports.getCategorySummary = async (req, res, next) => {
  try {
    const summary = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          totalProducts: { $sum: 1 },
          totalStock: { $sum: "$stock" },
          averagePrice: { $avg: "$price" },
          totalInventoryValue: {
            $sum: {
              $multiply: ["$price", "$stock"]
            }
          }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    res.status(200).json({
      count: summary.length,
      summary
    });
  } catch (error) {
    next(error);
  }
};