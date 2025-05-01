const config = require('config');
const jwt = require('jsonwebtoken');
const { redisClient } = require(config.get('path.core.redis'));

exports.verifyAuthentication = async (req, res, next) => {
    try {
        const { authorization } = req.headers;
        if (authorization) {
            const accessToken = authorization.split(' ')[1];
            const dirtyToken = await redisClient.get(accessToken);
            if (dirtyToken) {
                return res.status(401).json('Token expired');
            }
            jwt.verify(
                accessToken,
                config.get('app.jwtAccessKey'),
                (error, decoded) => {
                    if (error) {
                        if (error.name === 'TokenExpiredError') {
                            return res.status(401).json('Token expired');
                        }
                        return res.status(401).json('authentication required');
                    }
                    req.accessToken = accessToken;
                    return next();
                }
            );
        } else {
            return res.status(401).json('authentication required');
        }
    } catch (error) {
        return res.status(500).json(error);
    }
};
