const express = require('express');
const app = express();

require('dotenv/config');

// Get value of API_URL environment variable
const api = process.env.API_URL;

const morgan = require('morgan');
const mongoose = require('mongoose');

// Middleware to understand response JSON

// Use to render proper json 
app.use(express.json());

// Use to write log in the App
app.use(morgan('tiny'));

// Define the schema for the product
const productSchema = mongoose.Schema({
    name: String,
    image: String,
    countInStock: {
        type: Number,
        required: true
    }
});

// Define model for product and start with capital letter
const Product = mongoose.model('Product', productSchema);

// Connect to MongoDB DataBase
mongoose.connect('mongodb+srv://gauti:aKHf3FKrcPwb7BvX2024@cluster0.pwes2bh.mongodb.net/eshop-database?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => {
        // Display promise for success connection 
        console.log('Database Connection is ready ...');
    })
    .catch((err) => {
        // Display error for failing connection
        console.log(err);
    })

// API Get all products (async) / (await)
app.get(`${api}/products`, async (req, res) => {

    const productList = await Product.find();

    if (!productList) {
        res.status(400).json({
            description: 'No Product in the database'
        })
    }

    res.send(productList);

    /*const product = {
        id: 1,
        name: 'hair dresser',
        image: 'some_url'
    }
    res.send(product);*/

})

// API Post product
app.post(`${api}/products`, (req, res) => {

    const product = new Product({
        name: req.body.name,
        image: req.body.image,
        countInStock: req.body.countInStock
    })

    product.save().then((createProduct => {
        res.status(201).json(createProduct)
    })).catch((err) => {
        res.status(500).json({
            error: err,
            status: 500
        })
    })

    //const newProduct = req.body;
    //console.log(newProduct);
    //res.send(newProduct);
})

// Open running Server on a port
app.listen(9090, () => {
    console.log(api);
    console.log('App is running');
})