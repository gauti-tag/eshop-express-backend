const { Order } = require('../models/order');
const { OrderItem } = require('../models/order-item');

const express = require('express');
const router = express.Router();

// Get Orders
router.get('/', async (req, res) => {
    const ordersList = await Order.find();

    if (!ordersList) {
        res.status(400).json({
            status: 400,
            message: 'No Order in the database'
        })
    }

    res.status(200).json({ status: 200, message: 'List of Orders', data: ordersList });
})

// Post Order
router.post('/', async (req, res) => {

    // Save the OrderItems before creating the order
    // "Promise.all" help us to combine in 1 the 2 promises returned by the function

    const orderItemIds = Promise.all(req.body.orderItems.map(async orderItem => {
        let newOrderItem = new OrderItem({
            quantity: orderItem.quantity,
            product: orderItem.product
        })
        newOrderItem = await newOrderItem.save();
        return newOrderItem._id;
    }));

    const orderItemsIdsResolved = await orderItemIds; // use "await" again to get values of ids
    //console.log(orderItemsIdsResolved);

    const order = new Order({
        orderItems: orderItemsIdsResolved,
        shippingAddress1: req.body.shippingAddress1,
        shippingAddress2: req.body.shippingAddress2,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        totalPrice: req.body.totalPrice,
        user: req.body.user,
    })

    order.save().then((createOder) => {
        res.status(201).json({ status: 201, message: 'Created Order', data: createOder });
    }).catch((e) => {
        res.status(500).json({
            status: 500,
            message: e
        })
    })
})

// Export Orders router
module.exports = router;