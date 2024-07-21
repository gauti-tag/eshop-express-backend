const mongoose = require('mongoose');

// Define the schema for the product
const productSchema = mongoose.Schema({
    name: String,
    image: String,
    countInStock: {
        type: Number,
        required: true
    }
});

// Define and export the model for product and start with capital letter
exports.Product = mongoose.model('Product', productSchema);

//exports.Product
// Another way to Export in nodeJs
//module.exports = Product;