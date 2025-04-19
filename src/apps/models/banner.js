const config = require('config');
const mongoose = require(config.get('path.core.mongodb'))();

const bannerSchema = new mongoose.Schema(
    {
        image: {
            type: String,
            required: true
        },
        status: {
            type: String,
            default: 'show'
        }
    },
    { timestamps: true }
);

const bannerModel = mongoose.model('Banners', bannerSchema, 'banners');

module.exports = bannerModel;
