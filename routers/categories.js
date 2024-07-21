const { Category } = require('../models/category');
const express = require('express');
const router = express.Router();

// Get Categories
router.get('/', async (req, res) => {
    const categoryList = await Category.find();
    if (!categoryList) {
        res.status(400).json({
            description: 'No Category in the database'
        })
    }

    res.json(categoryList);
});

// Post Categories
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

});

// Delete Categories - url: /api/v1/:id
router.delete('/:id', (req, res) => {
    console.log(req.params);
    // Can use findByIdAndDelete or findByIdAndRemove
    Category.findByIdAndDelete(req.params.id).then(category => {
        if (category) {
            return res.status(200).json({ status: 200, description: 'the category is deleted' });
        } else {
            return res.status(404).json({ status: 404, description: 'Category not found' });
        }
    }).catch(e => {
        return res.status(400).json({ status: 400, description: e });
    })
});

// Export Router's Category
module.exports = router;