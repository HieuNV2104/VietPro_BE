const config = require('config');
const OrderModel = require(config.get('path.models.order'));
const ProductModel = require(config.get('path.models.product'));
const CustomertModel = require(config.get('path.models.customer'));
const transporter = require(config.get('path.libs.transporter'));
const ejs = require('ejs');
const moment = require('moment');
let querystring = require('qs');
let crypto = require('crypto');
const { redisClient } = require(config.get('path.core.redis'));

function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(
            /%20/g,
            '+'
        );
    }
    return sorted;
}

exports.createPayment = async (req, res) => {
    try {
        process.env.TZ = 'Asia/Ho_Chi_Minh';
        //
        let date = new Date();
        let createDate = moment(date).format('YYYYMMDDHHmmss');
        //
        let ipAddr =
            req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;
        //
        let tmnCode = config.get('payment.vnpay.vnp_TmnCode');
        let secretKey = config.get('payment.vnpay.vnp_HashSecret');
        let vnpUrl = config.get('payment.vnpay.vnp_Url');
        let returnUrl = config.get('payment.vnpay.vnp_Return_Url');
        let orderId = moment(date).format('DDHHmmss') + req.body.customer_id;
        let amount = req.body.totalPrice;
        let locale = 'vn';
        let currCode = 'VND';
        //
        let vnp_Params = {};
        vnp_Params['vnp_Version'] = '2.1.0';
        vnp_Params['vnp_Command'] = 'pay';
        vnp_Params['vnp_TmnCode'] = tmnCode;
        vnp_Params['vnp_Locale'] = locale;
        vnp_Params['vnp_CurrCode'] = currCode;
        vnp_Params['vnp_TxnRef'] = orderId;
        vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId;
        vnp_Params['vnp_OrderType'] = 'other';
        vnp_Params['vnp_Amount'] = amount * 100;
        vnp_Params['vnp_ReturnUrl'] = returnUrl;
        vnp_Params['vnp_IpAddr'] = ipAddr;
        vnp_Params['vnp_CreateDate'] = createDate;
        //
        vnp_Params = sortObject(vnp_Params);
        //
        let signData = querystring.stringify(vnp_Params, { encode: false });
        let hmac = crypto.createHmac('sha512', secretKey);
        let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
        vnp_Params['vnp_SecureHash'] = signed;
        vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });
        //
        redisClient.set(orderId, JSON.stringify(req.body), { EX: 900 });
        return res.status(200).json(vnpUrl);
    } catch (error) {
        return res.status(500).json(error);
    }
};

exports.returnPayment = async (req, res) => {
    try {
        let vnp_Params = req.query;
        let secureHash = vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];
        let orderId = vnp_Params['vnp_TxnRef'];
        vnp_Params = sortObject(vnp_Params);
        //
        let tmnCode = config.get('payment.vnpay.vnp_TmnCode');
        let secretKey = config.get('payment.vnpay.vnp_HashSecret');
        let signData = querystring.stringify(vnp_Params, { encode: false });
        let hmac = crypto.createHmac('sha512', secretKey);
        let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
        //
        if (secureHash === signed) {
            if (vnp_Params['vnp_ResponseCode'] == '00') {
                // insert order to database
                const order = JSON.parse(await redisClient.get(orderId));
                const { customer_id } = order;
                const { totalPrice } = order;
                const customer = await CustomertModel.findById({
                    _id: customer_id
                });
                const prdIds = order.items.map((items) => items.prd_id);
                const products = await ProductModel.find({
                    _id: { $in: prdIds }
                });
                const newItems = order.items.map((item) => {
                    const product = products.find(
                        (p) => p._id.toString() === item.prd_id
                    );
                    return { ...item, name: product.name || 'Unknow Product' };
                });
                //
                for (let item of order.items) {
                    const product = products.find(
                        (p) => p._id.toString() === item.prd_id
                    );
                    await ProductModel.updateOne(
                        { _id: item.prd_id },
                        { $set: { qty: product.qty - item.qty } }
                    );
                }
                // insert dtb
                await OrderModel({ ...order, is_paid: true }).save();
                // send mail
                const html = await ejs.renderFile(
                    config.get('path.views.mail'),
                    {
                        customer,
                        totalPrice,
                        newItems
                    }
                );
                await transporter(
                    customer.email,
                    'Xác nhận đơn hàng từ Vietpro Store',
                    html
                );
            }
            res.redirect(
                `http://localhost:3000/cart?code=${vnp_Params['vnp_ResponseCode']}`
            );
        } else {
            res.redirect('http://localhost:3000/cart?code=97');
        }
    } catch (error) {
        return res.status(500).json(error);
    }
};
