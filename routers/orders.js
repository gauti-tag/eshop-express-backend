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

    // Function to get the price of the product inside the order items
    const totalPrices = await Promise.all(orderItemsIdsResolved.map(async (orderItemId) => {
        const orderItem = await OrderItem.findById(orderItemId).populate('product');
        const totalPrice = orderItem.product.price * orderItem.quantity;
        return totalPrice;
    }));

    const totalPrice = totalPrices.reduce((a, b) => a + b, 0) // Combine the price to make it one ( sum )

    console.log(totalPrice)

    const order = new Order({
        orderItems: orderItemsIdsResolved,
        shippingAddress1: req.body.shippingAddress1,
        shippingAddress2: req.body.shippingAddress2,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        totalPrice: totalPrice,
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
    Order.findByIdAndDelete(req.params.id).then(async order => {
        if (order) {
            await order.orderItems.map(async record => {
                await OrderItem.findByIdAndDelete(record);  // Delete at the same time the orderItem
            })
            return res.status(200).json({ status: 200, message: 'the order has been deleted' });
        } else {
            return res.status(404).json({ status: 404, message: 'Order not found' });
        }
    }).catch(e => {
        return res.status(400).json({ status: 400, message: e });
    })
});

// Get Total Sales in the Order
router.get(`/get/totalsales`, async (req, res) => {

    // Magic method to get the sum of price sales
    const totalSales = await Order.aggregate([
        {
            $group:
            {
                _id: null, // the presence of "_id" is important because Mongoose always return "_id" in responses
                totalPrices: { $sum: '$totalPrice' }
            }
        }
    ]);

    if (!totalSales) return res.status(400).json({ status: 400, message: 'the order sales can not be generated' });
    res.status(200).json({ status: 200, message: 'Total price', data: { totalSales: totalSales.pop().totalPrices } }); // 'pop()' is used retrieve the first value in an array
})



// API Get how many orders in database (async) / (await)
router.get('/get/count', async (req, res) => {

    const orderCount = await Order.countDocuments(); // Count all documents according to the product's collection

    if (!orderCount) {
        res.status(400).json({
            status: 400,
            message: 'No Product in the database'
        })
    }
    res.status(200).json({ status: 200, message: 'All Orders', data: { count: orderCount } });
});


// Get Orders related to a user
router.get('/get/userorders/:userId', async (req, res) => {
    const userOrdersList = await Order.find({ user: req.params.userId })
        .populate({ path: 'orderItems', populate: { path: 'product', populate: 'category' } }).sort({ 'dataOrdered': -1 });

    if (!userOrdersList) {
        res.status(400).json({
            status: 400,
            message: 'No Order in the database'
        })
    }

    res.status(200).json({ status: 200, message: 'List of Orders', data: userOrdersList });
});


// Export Orders router
module.exports = router;