const jwt = require('jsonwebtoken');
const { jwtDecode } = require('jwt-decode');
const config = require('config');
const { redisClient } = require(config.get('path.core.redis'));

exports.createAccessToken = async (data, type) => {
    return jwt.sign({ email: data.email }, config.get('app.jwtAccessKey'), {
        expiresIn: type === 'user' ? '1h' : '1d'
    });
};

exports.createRefreshToken = async (data, type) => {
    return jwt.sign({ email: data.email }, config.get('app.jwtRefreshKey'), {
        expiresIn: type === 'user' ? '1d' : '30d'
    });
};

exports.setTokenBlacklist = async (token) => {
    const decoded = jwtDecode(token);
    if (decoded.exp > Date.now() / 1000) {
        redisClient.set(token, token, { EXAT: decoded.exp });
    }
};
