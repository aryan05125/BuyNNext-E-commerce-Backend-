const express = require("express");
const router = express.Router();

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  addReview
} = require("../controllers/productController");

const { protect, admin } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

 router.get("/", getProducts);
router.get("/:id", getProductById);

 router.post("/", protect, admin, upload.single("image"), createProduct);  
router.put("/:id", protect, admin, updateProduct);
router.delete("/:id", protect, admin, deleteProduct);

 router.post("/:id/review", protect, addReview);

module.exports = router;