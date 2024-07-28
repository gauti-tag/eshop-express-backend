function errorHandler(err, req, res, next) {
    if (err.name === 'UnauthorizedError') return res.status(401).json({ status: 401, message: 'user is not authorized' });
    if (err.name === 'ValidationError') return res.status(400).json({ status: 400, message: '' });

    return res.status(500).json({ status: 500, message: 'Server error' });
}
module.exports = errorHandler;