const config = require('config');
const OrderModel = require(config.get('path.models.order'));
const ProductModel = require(config.get('path.models.product'));
const CustomertModel = require(config.get('path.models.customer'));
const paginaton = require(config.get('path.libs.pagination'));
const transporter = require(config.get('path.libs.transporter'));
const ejs = require('ejs');

exports.index = async (req, res) => {
    try {
        const query = {};
        const { id } = req.params;
        const page = +req.query.page || 1;
        const limit = +req.query.limit || 10;
        const skip = page * limit - limit;
        //
        query.customer_id = id;

        //
        const orders = await OrderModel.find(query)
            .sort({ _id: -1 })
            .skip(skip)
            .limit(limit);
        //

        return res.status(200).json({
            status: 'Success',
            filters: {
                page,
                limit,
                customer_id: id
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
// order detail
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

            return { ...item, name: product.name, image: product.image };
        });

        const newOrder = { ...order._doc, items: newItems };

        //
        return res.status(200).json({
            status: 'Success',
            data: {
                docs: newOrder
            }
        });
    } catch (error) {
        return res.status(500).json(error);
    }
};
// cancel order
exports.cancelOrder = async (req, res) => {
    try {
        const { id } = req.params;
        //
        await OrderModel.updateOne(
            { _id: id },
            { $set: { status: 'cancelled' } }
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

// order
exports.order = async (req, res) => {
    try {
        const { body } = req;
        const { customer_id } = body;
        const { totalPrice } = body;
        const customer = await CustomertModel.findById({ _id: customer_id });
        const prdIds = body.items.map((items) => items.prd_id);
        const products = await ProductModel.find({
            _id: { $in: prdIds }
        });
        const newItems = body.items.map((item) => {
            const product = products.find(
                (p) => p._id.toString() === item.prd_id
            );
            return { ...item, name: product.name || 'Unknow Product' };
        });
        //
        for (let item of body.items) {
            const product = products.find(
                (p) => p._id.toString() === item.prd_id
            );
            await ProductModel.updateOne(
                { _id: item.prd_id },
                { $set: { qty: product.qty - item.qty } }
            );
        }
        // insert dtb
        await OrderModel(body).save();
        // send mail
        const html = await ejs.renderFile(config.get('path.views.mail'), {
            customer,
            totalPrice,
            newItems
        });

        await transporter.sendMail({
            from: `VietPro Store" <${config.get('mail.auth.user')}>`,
            to: customer.email,
            subject: 'Xác nhận đơn hàng từ Vietpro Store',
            html
        });

        return res.status(200).json({
            status: 'success',
            message: 'Order successfully'
        });
    } catch (error) {
        return res.status(500).json(error);
    }
};
