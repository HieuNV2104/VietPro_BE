const config = require('config');
const mongoose = require(config.get('path.core.mongodb'))();

const userTokenSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Types.ObjectId,
            required: true
        },
        accessToken: {
            type: String,
            require: true
        },
        refreshToken: {
            type: String,
            require: true
        }
    },
    { timestamps: true }
);

const UserTokenModel = mongoose.model(
    'UserTokens',
    userTokenSchema,
    'userTokens'
);

module.exports = UserTokenModel;
