const config = require('config');
const mongoose = require(config.get('path.core.mongodb'))();

const customerSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);

const customerModel = mongoose.model('Customers', customerSchema, 'customers');

module.exports = customerModel;
