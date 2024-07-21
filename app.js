const express = require('express');
const app = express();

// Require to use variable in env file
require('dotenv/config');

// Get value of API_URL environment variable
const api = process.env.API_URL;

// Logic routers
const productsRouter = require('./routers/products'); //Products
const userRouter = require('./routers/users'); // Users
const categoryRouter = require('./routers/categories'); // Categories
const orderRouter = require('./routers/orders'); // Orders

const morgan = require('morgan'); // Library for writing log
const mongoose = require('mongoose'); // library for MangoDB ( Oriented Collections )

// Middleware to understand response JSON
// Use to render proper json
app.use(express.json());

// Use to write log in the App
app.use(morgan('tiny'));

// Routers
app.use(`${api}/products`, productsRouter);
app.use(`${api}/users`, userRouter);
app.use(`${api}/categories`, categoryRouter);
app.use(`${api}/orders`, orderRouter);

// Connect to MongoDB DataBase
mongoose.connect(process.env.DATABASE_CONNECTION_STRING)
    .then(() => {
        // Display promise for success connection
        console.log('Database Connection is ready ...');
    })
    .catch((err) => {
        // Display error for failing connection
        console.log(err);
    })

// Open running Server on a port
app.listen(9090, () => {
    console.log(api);
    console.log('App is running on http://localhost:9090');
})