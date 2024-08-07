const express = require('express');
const app = express();
const cors = require('cors');

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
const authJwt = require('./helpers/jwt'); // function to protect API routes
const errorHandler = require('./helpers/error-handler');

// Middleware to understand response JSON
// Use to render proper json
app.use(express.json());

// Use to write log in the App
app.use(morgan('tiny'));

// Enabling Cors
app.use(cors());
app.options('*', cors());

// Enabling protected API routes
app.use(authJwt());

// handling kind of errors
app.use(errorHandler);

// Set Static folder path for our images. NB: Add '/' in front of the path
app.use('/public/uploads', express.static(__dirname + '/public/uploads'));


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