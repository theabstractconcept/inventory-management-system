const express = require("express");
const router = express.Router();

const {
  createProduct,
  createManyProducts,
  getAllProducts,
  getProductById,
  updateProduct,
  restockProduct,
  sellProduct,
  deleteProduct,
  getLowStockReport,
  getCategorySummary
} = require("../controllers/productController");

router.post("/", createProduct);
router.post("/bulk", createManyProducts);

router.get("/", getAllProducts);

router.get("/reports/low-stock", getLowStockReport);
router.get("/reports/category-summary", getCategorySummary);

router.get("/:id", getProductById);
router.put("/:id", updateProduct);
router.patch("/:id/restock", restockProduct);
router.patch("/:id/sale", sellProduct);
router.delete("/:id", deleteProduct);

module.exports = router;