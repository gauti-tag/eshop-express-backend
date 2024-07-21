const { User } = require('../models/user');
const express = require('express');
const router = express.Router();

// User Get
router.get('/', async (req, res) => {
    const userList = await User.find();
    if (!userList) {
        res.status(400).json({
            description: 'No User in the database'
        })
    }
    res.send(userList)
});

// User Post
router.post('/', (req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email
    })

    user.save().then((createUser) => {
        res.status(201).json(createUser);
    }).catch((e) => {
        res.status(500).json({
            status: 500,
            error: e
        })
    })
}
);

module.exports = router;