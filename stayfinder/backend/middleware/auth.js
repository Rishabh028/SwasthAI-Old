const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    // Get token from header (Bearer token)
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user; // assumes your token payload is { user: { id: ... } }
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};