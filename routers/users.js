const { User } = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//const mongoose = require('mongoose');

// Users Get
router.get(`/`, async (req, res) => {
    const userList = await User.find().select('-passwordHash');
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
        passwordHash: bcrypt.hashSync(req.body.password, 10),
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

// Get an user
router.get(`/:id`, async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ status: 400, message: 'Invalid User ID.' });
    const user = await User.findById(req.params.id).select('-passwordHash'); // Excluding passwordHash
    if (!user) {
        res.status(400).json({
            status: 400,
            message: 'No User found in the database'
        });
    }
    res.status(200).json({ status: 200, message: 'User found', data: user });
});

// Login route an logic

router.post(`/login`, async (req, res) => {
    const user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(400).json({ status: 400, message: 'The user not found.' });

    if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
        secret = process.env.SECRET
        const token = jwt.sign({
            userId: user.id,
            isAdmin: user.isAdmin,
        },
            secret,
            {
                expiresIn: '1d',
            }
        );
        res.status(200).json({ status: 200, message: 'User Authenticated', data: { token: token } });

    } else {
        res.status(400).json({ status: 400, message: 'Password is wrong', data: null });
    }
});

module.exports = router;