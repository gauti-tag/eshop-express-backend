const expressJwt = require('express-jwt');

// function to ask jwt in all requests
function authJwt() {
    const secret = process.env.SECRET;
    const api = process.env.API_URL;
    return expressJwt({
        secret,
        algorithms: ['HS256'],
        isRevoked: isRevoked, // Magic method to reject the token is the user is not an Admin
    }).unless({
        path: [
            { url: /\/public\/uploads(.*)/, methods: ['GET', 'OPTIONS'] },
            { url: /\/api\/v1\/products(.*)/, methods: ['GET', 'OPTIONS'] },
            { url: /\/api\/v1\/categories(.*)/, methods: ['GET', 'OPTIONS'] },
            `${api}/users/login`,
            `${api}/users/register`,
        ]
    });
}

// Method to revoke requests actions if the user is not an Admin
async function isRevoked(req, payload, done) {
    if (!payload.isAdmin) {
        return done(null, true);
    }

    return done();
}

module.exports = authJwt;