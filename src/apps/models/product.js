const config = require('config');
const mongoose = require(config.get('path.core.mongodb'))();

const productSchema = new mongoose.Schema(
    {
        image: {
            type: String,
            required: true
        },
        details: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        category_id: {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: 'Categories'
        },
        status: {
            type: String,
            required: true
        },
        is_featured: {
            type: Boolean,
            default: false
        },
        promotion: {
            type: String,
            required: true
        },
        accessories: {
            type: String,
            required: true
        },
        is_stock: {
            type: Boolean,
            default: true
        },
        name: {
            type: String,
            required: true,
            text: true
        },
        warranty: {
            type: String,
            required: true
        },
        sale: {
            type: mongoose.Types.ObjectId,
            default: null,
            ref: 'Sales'
        },
        qty: {
            type: Number,
            required: true,
            set: (value) => {
                this.is_stock = value > 0;
                return value;
            }
        }
    },
    { timestamps: true }
);

const ProductModel = mongoose.model('Products', productSchema, 'products');

module.exports = ProductModel;
