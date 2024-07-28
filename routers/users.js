const { User } = require('../models/user');
const express = require('express');
const router = express.Router();

// User Get
router.get(`/`, async (req, res) => {
    const userList = await User.find();
    if (!userList) {
        res.status(400).json({
            status: 400,
            message: 'No User in the database'
        });
    }
    res.status(200).json({ status: 200, message: 'List of users', data: userList });
});

// User Post
router.post(`/`, (req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: req.body.passwordHash,
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
    })

    user.save().then((createUser) => {
        res.status(201).json({ status: 201, message: 'created user', data: createUser });
    }).catch((e) => {
        res.status(500).json({
            status: 500,
            error: e
        })
    })
}
);

module.exports = router;