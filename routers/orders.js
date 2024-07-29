const { Order } = require('../models/order');
const { OrderItem } = require('../models/order-item');

const express = require('express');
const router = express.Router();

// Get Orders
// 'sort() used to order - sort({'dateOrdered': -1}) ordered by date from newest to oldest'
router.get('/', async (req, res) => {
    const ordersList = await Order.find().populate('user', 'name').sort({ 'dateOrdered': -1 }); // "populate(entity, *fields)" is used to give details of user in order lists

    if (!ordersList) {
        res.status(400).json({
            status: 400,
            message: 'No Order in the database'
        })
    }

    res.status(200).json({ status: 200, message: 'List of Orders', data: ordersList });
});

// Get Order
router.get(`/:id`, async (req, res) => {
    const order = await Order.findById(req.params.id)
        .populate('user', 'name')
        .populate({ path: 'orderItems', populate: { path: 'product', populate: 'category' } }) // populate orderItems -> product -> category

    if (!order) {
        res.status(400).json({
            status: 400,
            message: 'No Order in the database'
        })
    }
    res.status(200).json({ status: 200, message: 'Order found', data: order });
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

// Update Order
router.put(`/:id`, async (req, res) => {
    const order = await Order.findByIdAndUpdate(req.params.id, {
        status: req.body.status,
    },
        { new: true }
    );

    if (!order) {
        return res.status(400).json({ status: 400, description: 'The Order was not updated' });
    }

    res.status(200).json({ status: 200, message: 'Order updated', data: order });
})

// Delete order - url: /api/v1/:id
router.delete(`/:id`, (req, res) => {
    //console.log(req.params);
    // Can use findByIdAndDelete or findByIdAndRemove
    Order.findByIdAndDelete(req.params.id).then(order => {
        if (order) {
            return res.status(200).json({ status: 200, message: 'the order has been deleted' });
        } else {
            return res.status(404).json({ status: 404, message: 'Order not found' });
        }
    }).catch(e => {
        return res.status(400).json({ status: 400, message: e });
    })
});


// Export Orders router
module.exports = router;