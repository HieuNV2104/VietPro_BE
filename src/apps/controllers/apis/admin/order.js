const config = require('config');
const OrderModel = require(config.get('path.models.order'));
const ProductModel = require(config.get('path.models.product'));
const CustomerModel = require(config.get('path.models.customer'));
const paginaton = require(config.get('path.libs.pagination'));

exports.index = async (req, res) => {
    try {
        const query = {};
        const limit = +req.query.limit || 10;
        const page = +req.query.page || 1;
        const skip = page * limit - limit;
        //
        if (req.query.id) {
            query._id = req.query.id;
        }
        //
        const orders = await OrderModel.find(query)
            .sort({ _id: -1 })
            .skip(skip)
            .limit(limit);
        //
        return res.status(200).json({
            status: 'Success',
            filter: {
                limit,
                page
            },
            data: {
                docs: orders,
                pages: await paginaton(OrderModel, query, page, limit)
            }
        });
    } catch (error) {
        return res.status(500).json(error);
    }
};

exports.show = async (req, res) => {
    try {
        const { id } = req.params;
        //
        const order = await OrderModel.findById(id);

        const prdIds = order.items.map((i) => i.prd_id);
        const products = await ProductModel.find({ _id: { $in: prdIds } });
        const orderClone = JSON.parse(JSON.stringify(order));
        const newItems = orderClone.items.map((item) => {
            const product = products.find(
                (p) => p._id.toString() === item.prd_id
            );

            return { ...item, name: product.name };
        });

        const newOrder = { ...order._doc, items: newItems };
        const customerOrder = await CustomerModel.findById(
            orderClone.customer_id
        );
        const { password, ...customer } = customerOrder._doc;
        //
        return res.status(200).json({
            status: 'Success',
            data: {
                docs: newOrder,
                customer
            }
        });
    } catch (error) {
        return res.status(500).json(error);
    }
};

exports.confirmOrder = async (req, res) => {
    try {
        const { id } = req.params;
        //
        await OrderModel.updateOne(
            { _id: id },
            { $set: { status: 'shipping' } }
        );
        //
        return res.status(200).json({
            status: 'Success',
            message: 'Cancel Successfully'
        });
    } catch (error) {
        return res.status(500).json(error);
    }
};

exports.deliveredOrder = async (req, res) => {
    try {
        const { id } = req.params;
        //
        await OrderModel.updateOne(
            { _id: id },
            { $set: { status: 'delivered' } }
        );
        //
        return res.status(200).json({
            status: 'Success',
            message: 'Cancel Successfully'
        });
    } catch (error) {
        return res.status(500).json(error);
    }
};

exports.doneOrder = async (req, res) => {
    try {
        const { id } = req.params;
        //
        await OrderModel.updateOne(
            { _id: id },
            { $set: { status: 'delivered', is_paid: true } }
        );
        //
        return res.status(200).json({
            status: 'Success',
            message: 'Cancel Successfully'
        });
    } catch (error) {
        return res.status(500).json(error);
    }
};
