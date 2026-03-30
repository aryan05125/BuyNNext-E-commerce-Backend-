const Cart = require("../models/Cart");

 exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            cart = await Cart.create({
                user: req.user._id,
                items: [{ product: productId, quantity }]
            });
        } else {
            const itemIndex = cart.items.findIndex(
                item => item.product.toString() === productId
            );

            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity;
            } else {
                cart.items.push({ product: productId, quantity });
            }

            await cart.save();
        }

        res.json({
            message: "Product added to cart",
            cart
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

 exports.getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id })
            .populate("items.product");

        res.json(cart || { items: [] });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

 exports.updateCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        const cart = await Cart.findOne({ user: req.user._id });

        const item = cart.items.find(
            item => item.product.toString() === productId
        );

        if (item) {
            item.quantity = quantity;
            await cart.save();
        }

        res.json({
            message: "Cart updated",
            cart
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

 exports.removeFromCart = async (req, res) => {
    try {
        const { productId } = req.body;

        const cart = await Cart.findOne({ user: req.user._id });

        cart.items = cart.items.filter(
            item => item.product.toString() !== productId
        );

        await cart.save();

        res.json({
            message: "Item removed",
            cart
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};