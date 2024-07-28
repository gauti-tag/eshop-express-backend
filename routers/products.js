const { Product } = require('../models/product');
const { Category } = require('../models/category');
const express = require('express');
const router = express.Router();

// API Get all products (async) / (await)
router.get('/', async (req, res) => {

    const productList = await Product.find();
    //const productList = await Product.find().populate('category'); // populate with category details
    //const productList = await Product.find().select('name image'); // Select which columns to render
    //const productList = await Product.find().select('name image -_id'); // Select which columns to render minus the column "id"
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

// API Get a product (async) / (await)
router.get('/:id', async (req, res) => {

    //const product = await Product.findById(req.params.id);
    const product = await Product.findById(req.params.id).populate('category'); // using "populate" render the details of the category

    if (!product) {
        res.status(400).json({
            status: 400,
            message: 'No Product in the database'
        })
    }
    res.status(200).json({ status: 200, message: 'Product details', data: product });
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

// API to update a product (async) / (await)
router.put('/:id', async (req, res) => {

    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).json({ status: 400, message: 'Invalid category.' });

    const product = await Product.findByIdAndUpdate(req.params.id, {
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
    },
        { new: true }
    );

    if (!product) {
        res.status(500).json({
            status: 500,
            message: 'Fail to update the Product in the database'
        })
    }
    res.status(200).json({ status: 200, message: 'Product updated', data: product });
});

// Delete a Product - url: /api/v1/:id
router.delete('/:id', (req, res) => {
    //console.log(req.params);
    // Can use findByIdAndDelete or findByIdAndRemove
    Product.findByIdAndDelete(req.params.id).then(product => {
        if (product) {
            return res.status(200).json({ status: 200, description: 'the product is deleted' });
        } else {
            return res.status(404).json({ status: 404, description: 'Product not found' });
        }
    }).catch(e => {
        return res.status(400).json({ status: 400, description: e });
    })
});



module.exports = router;