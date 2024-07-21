const { status } = require('express/lib/response');
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


router.post('/', async (req, res) => {
    const category = new Category({
        name: req.body.name,
        color: req.body.color,
        icon: req.body.icon
    })

    const createCategory = await category.save();
    if (!createCategory)
        return res.status(400).json({ status: 400, description: 'The category can not be created' });

    res.status(200).json(createCategory);

})

// Export Router's Category
module.exports = router;