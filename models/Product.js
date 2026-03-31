const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String
    },
    stock: {
        type: Number,
        default: 0
    },
    image: {
        type: String
    },
   
    reviews: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        name: String,
        rating: Number,
        comment: String
    }],
    numReviews: {
        type: Number,
        default: 0
    },
    ratings: {
        type: Number,
        default: 0
    }


    
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);