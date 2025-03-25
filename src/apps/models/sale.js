const config = require('config');
const mongoose = require(config.get('path.core.mongodb'))();

const saleSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            text: true
        },

        type: {
            type: String,
            required: true
        },
        value: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);

const saleModel = mongoose.model('Sales', saleSchema, 'sales');

module.exports = saleModel;
