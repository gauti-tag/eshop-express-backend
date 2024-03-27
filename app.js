const express = require('express');
const app = express();

require('dotenv/config');
const api = process.env.API_URL;

app.get('/', (req, res) => {
    res.send('Hello World !');
})

app.listen(9090, () => {
    console.log(api);
    console.log('App is running');
})