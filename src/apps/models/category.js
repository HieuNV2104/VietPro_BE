const config = require('config');
const mongoose = require(config.get('path.core.mongodb'))();

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            text: true
        }
    },
    { timestamps: true }
);

const CategoryModel = mongoose.model(
    'Categories',
    categorySchema,
    'categories'
);

module.exports = CategoryModel;
