const config = require('config');
const mongoose = require(config.get('path.core.mongodb'))();

const customerTokenSchema = new mongoose.Schema(
    {
        customerId: {
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

const CustomerTokenModel = mongoose.model(
    'CustomerTokens',
    customerTokenSchema,
    'customerTokens'
);

module.exports = CustomerTokenModel;
