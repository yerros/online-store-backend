require('dotenv').config();
const jwt = require('jsonwebtoken');

const adminMiddleware = (req, res, next) => {
    const token = req.header('secret_token');
    if (!token) {
        return res.status(401).json({
            message: 'Access denied!'
        })
    }
    try {
        const decoded = jwt.verify(token, process.env.secretJWT);
        req.admin = decoded.admin;
        next()
    } catch (error) {
        return res.status(401).json({
            message: "token is not valid"
        })
    }
}

const userMiddleware = (req, res, next) => {
    const token = req.header('secret_token');
    if (!token) {
        return res.status(401).json({
            message: 'Access denied!'
        })
    }
    try {
        const decoded = jwt.verify(token, process.env.secretJWT);
        req.user = decoded.user;
        next()
    } catch (error) {
        return res.status(401).json({
            message: "token is not valid"
        })
    }
}

module.exports = {
    adminMiddleware,
    userMiddleware
}