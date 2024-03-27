const express = require('express');
const app = express();

require('dotenv/config');
const api = process.env.API_URL;
const morgan = require('morgan');
const mongoose = require('mongoose');

// Middleware to understand response JSON
app.use(express.json());
app.use(morgan('tiny'));
mongoose.connect('mongodb+srv://gauti:aKHf3FKrcPwb7BvX2024@cluster0.pwes2bh.mongodb.net/eshop-database?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => {
        console.log('Database Connection is ready ...');
    })
    .catch((err) => {
        console.log(err);
    })

app.get(`${api}/products`, (req, res) => {
    const product = {
        id: 1,
        name: 'hair dresser',
        image: 'some_url'
    }
    res.send(product);
})

app.post(`${api}/products`, (req, res) => {
    const newProduct = req.body;
    console.log(newProduct);
    res.send(newProduct);
})

app.listen(9090, () => {
    console.log(api);
    console.log('App is running');
})