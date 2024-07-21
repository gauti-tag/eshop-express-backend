const { Category } = require('../models/category');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const categoryList = await Category.find();
    if (!categoryList) {
        res.status(400).json({
            description: 'No Category in the database'
        })
    }

    res.json(categoryList);
})


router.post('/', (req, res) => {
    const category = new Category({
        name: req.body.name
    })

    category.save().then((createCategory) => {
        res.status(201).json(createCategory);
    }).catch((e) => {
        res.status(500).json({
            status: 500,
            error: e
        })
    })


})

// Export Router's Category
module.exports = router;