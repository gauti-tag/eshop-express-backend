const express = require('express');
const app = express();

require('dotenv/config');
const api = process.env.API_URL;

// Middleware to understand response JSON
app.use(express.json());

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