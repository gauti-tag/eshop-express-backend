const Product = require('../models/product');
const express = require('express');
const router = express.Router();

// API Get all products (async) / (await)
router.get('/', async (req, res) => {

    const productList = await Product.find();
    console.log(` Product list ${productList}`)

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
});

// API Post product
router.post('/', (req, res) => {

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
});

module.exports = router;