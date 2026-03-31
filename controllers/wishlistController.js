const Wishlist = require("../models/Wishlist");

 exports.addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;

        let wishlist = await Wishlist.findOne({ user: req.user._id });

        if (!wishlist) {
            wishlist = await Wishlist.create({
                user: req.user._id,
                products: [productId]
            });
        } else {
            if (!wishlist.products.includes(productId)) {
                wishlist.products.push(productId);
            }
            await wishlist.save();
        }

        res.json({
            message: "Added to wishlist ❤️",
            wishlist
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

 exports.getWishlist = async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne({ user: req.user._id })
            .populate("products");

        res.json(wishlist || { products: [] });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

 exports.removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.body;

        const wishlist = await Wishlist.findOne({ user: req.user._id });

        if (!wishlist) {
            return res.status(404).json({ message: "Wishlist not found" });
        }

        wishlist.products = wishlist.products.filter(
            p => p.toString() !== productId
        );

        await wishlist.save();

        res.json({
            message: "Removed from wishlist ❌",
            wishlist
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};