const config = require('config');
const mongoose = require(config.get('path.core.mongodb'))();

const userSchema = new mongoose.Schema(
    {
        full_name: {
            type: String,
            required: true
        },
        role: {
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
        }
    },
    { timestamps: true }
);

const userModel = mongoose.model('Users', userSchema, 'users');

module.exports = userModel;
