const express = require("express");
const router = express.Router();

const {
    createCoupon,
    applyCoupon
} = require("../controllers/couponController");

const { protect, admin } = require("../middleware/authMiddleware");

router.post("/create", protect, admin, createCoupon);
router.post("/apply", protect, applyCoupon);

module.exports = router;