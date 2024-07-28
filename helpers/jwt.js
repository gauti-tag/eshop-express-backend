const expressJwt = require('express-jwt');

// function to ask jwt in all requests
function authJwt() {
    const secret = process.env.SECRET
    return expressJwt({
        secret,
        algorithms: ['HS256']
    });
}

module.exports = authJwt;