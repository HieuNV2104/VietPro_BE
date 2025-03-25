const config = require('config');
const { request } = require('express');
const mongoose = require(config.get('path.core.mongodb'))();

const orderSchema = new mongoose.Schema(
    {
        customer_id: {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: 'Customers'
        },
        totalPrice: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            default: 'waiting'
        },
        is_paid: {
            type: Boolean,
            default: false
        },
        items: [
            {
                prd_id: {
                    type: String,
                    required: true
                },
                qty: {
                    type: Number,
                    required: true
                },
                price: {
                    type: Number,
                    required: true
                }
            }
        ]
    },
    { timestamps: true }
);

const OrderModel = mongoose.model('Orders', orderSchema, 'orders');

module.exports = OrderModel;
