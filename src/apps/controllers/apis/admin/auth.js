const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('config');
const UserModel = require(config.get('path.models.user'));
const UserTokenModel = require(config.get('path.models.userToken'));
const { redisClient } = require(config.get('path.core.redis'));
const {
    createAccessToken,
    createRefreshToken,
    setTokenBlacklist
} = require(config.get('path.libs.handleToken'));

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        //
        const isEmail = await UserModel.findOne({ email });
        if (!isEmail) {
            return res.status(400).json('email not valid');
        }
        const isPassword = await bcrypt.compare(password, isEmail.password);
        if (!isPassword) {
            return res.status(400).json('password not valid');
        }
        //
        if (isEmail && isPassword) {
            const { password, ...user } = isEmail._doc;
            const accessToken = await createAccessToken(user, 'user');
            const refreshToken = await createRefreshToken(user, 'user');
            const isToken = await UserTokenModel.findOne({
                userId: user._id
            });
            if (isToken) {
                // move token to redis
                setTokenBlacklist(isToken.accessToken);
                setTokenBlacklist(isToken.refreshToken);
                // delete token from dtb
                await UserTokenModel.deleteOne({
                    userId: user._id
                });
            }
            await UserTokenModel({
                userId: user._id,
                accessToken,
                refreshToken
            }).save();
            res.cookie('refreshToken', refreshToken, { httpOnly: true });
            //
            return res.status(200).json({
                user,
                accessToken
            });
        }
    } catch (error) {
        return res.status(500).json(error);
    }
};

exports.logoutUser = async (req, res) => {
    try {
        const { accessToken } = req;
        const tokenUser = await UserTokenModel.findOne({ accessToken });
        // move token to redis
        setTokenBlacklist(tokenUser.accessToken);
        setTokenBlacklist(tokenUser.refreshToken);
        // delete token from dtb
        await UserTokenModel.deleteOne({ accessToken });
        return res.status(200).json('Logout Successfully');
    } catch (error) {
        return res.status(500).json(error);
    }
};

exports.refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.cookies;
        if (!refreshToken) {
            return res.status(401).json('authentication required');
        }
        const dirtyToken = await redisClient.get(refreshToken);
        if (dirtyToken) {
            return res.status(401).json('Token expired');
        }
        jwt.verify(
            refreshToken,
            config.get('app.jwtRefreshKey'),
            async (error, decoded) => {
                if (error) {
                    return res.status(401).json('authentication required');
                }
                const accessToken = await createAccessToken(decoded, 'user');
                await UserTokenModel.updateOne(
                    { refreshToken },
                    { $set: { accessToken } }
                );
                //
                return res.status(200).json({
                    accessToken
                });
            }
        );
    } catch (error) {
        return res.status(500).json(error);
    }
};
