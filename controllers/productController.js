const Product = require("../models/Product");

 exports.createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);

        res.status(201).json({
            message: "Product created",
            product
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

 exports.getProducts = async (req, res) => {
    try {
         const keyword = req.query.keyword
            ? {
                  name: {
                      $regex: req.query.keyword,
                      $options: "i"
                  }
              }
            : {};

         let filter = {};

        if (req.query.category) {
            filter.category = req.query.category;
        }

        if (req.query.minPrice || req.query.maxPrice) {
            filter.price = {};
            if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
            if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
        }

         const queryObj = { ...keyword, ...filter };

         const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;
        const skip = (page - 1) * limit;

         let sort = {};
        if (req.query.sort === "price_asc") sort.price = 1;
        if (req.query.sort === "price_desc") sort.price = -1;
        if (req.query.sort === "newest") sort.createdAt = -1;

         const products = await Product.find(queryObj)
            .sort(sort)
            .skip(skip)
            .limit(limit);

        const total = await Product.countDocuments(queryObj);

        res.json({
            total,
            page,
            pages: Math.ceil(total / limit),
            products
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

 exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

 exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json({
            message: "Product updated",
            product
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

 exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json({ message: "Product deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};