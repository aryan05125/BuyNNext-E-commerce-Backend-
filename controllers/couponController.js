const Coupon = require("../models/Coupon");

 exports.createCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.create(req.body);

        res.status(201).json({
            message: "Coupon created 🎯",
            coupon
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

 exports.applyCoupon = async (req, res) => {
    try {
        const { code, totalAmount } = req.body;

        const coupon = await Coupon.findOne({ code });

        if (!coupon) {
            return res.status(404).json({ message: "Invalid coupon ❌" });
        }

         if (coupon.expiryDate < new Date()) {
            return res.status(400).json({ message: "Coupon expired ⌛" });
        }

         if (totalAmount < coupon.minAmount) {
            return res.status(400).json({
                message: `Minimum amount should be ₹${coupon.minAmount}`
            });
        }

         const discountAmount = (totalAmount * coupon.discount) / 100;
        const finalAmount = totalAmount - discountAmount;

        res.json({
            message: "Coupon applied 🎉",
            discount: discountAmount,
            finalAmount
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};