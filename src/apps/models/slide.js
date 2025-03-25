const config = require('config');
const mongoose = require(config.get('path.core.mongodb'))();

const slideSchema = new mongoose.Schema(
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

const slideModel = mongoose.model('Slides', slideSchema, 'slides');

module.exports = slideModel;
