const { Order } = require('../models/order');

const express = require('express');
const router = express.Router();

// Get Orders
router.get('/', async (req, res) => {
    const ordersList = await Order.find();

    if (!ordersList) {
        res.status(400).json({
            description: 'No Order in the database'
        })
    }

    res.json(ordersList);
})

// Post Order
router.post('/', (req, res) => {
    const order = new Order({
        name: req.body.name
    })

    order.save().then((createOder) => {
        res.status(201).json(createOder);
    }).catch((e) => {
        res.status(500).json({
            status: 500,
            error: e
        })
    })
})

// Export Orders router
module.exports = router;