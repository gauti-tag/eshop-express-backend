const { Product } = require('../models/product');
const { Category } = require('../models/category');
const express = require('express');
const router = express.Router();

// API Get all products (async) / (await)
router.get('/', async (req, res) => {

    const productList = await Product.find();
    //console.log(` Product list ${productList}`)

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
router.post('/', async (req, res) => {

    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).json({ status: 400, message: 'Invalid category.' });

    const product = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
    })

    const newProduct = await product.save();
    if (!newProduct)
        return res.status(500).json({ status: 500, message: 'The product can not be created.' })

    res.status(201).json({ status: 201, message: 'The product has been created', data: newProduct })

    /*product.save().then((createProduct => {
        res.status(201).json(createProduct)
    })).catch((err) => {
        res.status(500).json({
            error: err,
            status: 500
        })
    })*/
});

module.exports = router;