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

// Get Category
router.get('/:id', async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (!category) {
        res.status(400).json({ status: 400, description: 'The category with the given ID was not found' });
    }
    res.status(200).json(category);
})

// Post Category
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

// Update Category
router.put('/:id', async (req, res) => {
    const category = await Category.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color
    },
        { new: true }
    );

    if (!category) {
        return res.status(400).json({ status: 400, description: 'The Category was not updated' });
    }

    res.status(200).json({ category });
})

// Delete Categories - url: /api/v1/:id
router.delete('/:id', (req, res) => {
    console.log(req.params);
    // Can use findByIdAndDelete or findByIdAndRemove
    Category.findByIdAndDelete(req.params.id).then(category => {
        if (category) {
            return res.status(200).json({ status: 200, message: 'the category is deleted' });
        } else {
            return res.status(404).json({ status: 404, message: 'Category not found' });
        }
    }).catch(e => {
        return res.status(400).json({ status: 400, message: e });
    })
});

// Export Router's Category
module.exports = router;