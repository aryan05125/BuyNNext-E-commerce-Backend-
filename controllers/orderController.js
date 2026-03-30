const Order = require("../models/Order");
const Cart = require("../models/Cart");

 exports.placeOrder = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id })
            .populate("items.product");

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        let total = 0;

        const orderItems = cart.items.map(item => {
            total += item.product.price * item.quantity;

            return {
                product: item.product._id,
                quantity: item.quantity
            };
        });

        const order = await Order.create({
            user: req.user._id,
            items: orderItems,
            totalPrice: total
        });

         cart.items = [];
        await cart.save();

        res.status(201).json({
            message: "Order placed successfully",
            order
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

 exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate("items.product");

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

 exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("user")
            .populate("items.product");

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

 exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body; // ✅ FIX

         if (!status) {
            return res.status(400).json({ message: "Status is required" });
        }

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

         order.status = status;
        await order.save();

        res.json({
            message: "Order status updated",
            order
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};