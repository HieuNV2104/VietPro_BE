const config = require('config');
const SaleModel = require(config.get('path.models.sale'));
const ProductModel = require(config.get('path.models.product'));
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
        const sales = await SaleModel.find(query)
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
                docs: sales,
                pages: await paginaton(SaleModel, query, page, limit)
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
        const sale = await SaleModel.findById(id);
        //
        return res.status(200).json({
            status: 'Success',
            data: {
                docs: sale
            }
        });
    } catch (error) {
        return res.status(500).json(error);
    }
};

exports.createSale = async (req, res) => {
    try {
        const { code, type, value, status } = req.body;
        //
        const isSale = await SaleModel.findOne({
            $text: { $search: code }
        });
        if (isSale) {
            return res.status(400).json('Sale exists!');
        }
        //
        const sale = {
            code,
            type,
            value,
            status
        };
        await SaleModel(sale).save();
        return res.status(200).json({
            status: 'Success',
            message: 'Create successfully'
        });
    } catch (error) {
        return res.status(500).json(error);
    }
};

exports.updateSale = async (req, res) => {
    try {
        const { id } = req.params;
        const { code, type, value, status } = req.body;
        const isSale = await SaleModel.findOne({
            $text: { $search: code }
        });
        if (isSale && isSale._id.toString() !== id) {
            return res.status(400).json('Sale exists!');
        }

        const sale = {
            code,
            type,
            value,
            status
        };
        await SaleModel.updateOne({ _id: id }, { $set: sale });
        return res.status(200).json({
            status: 'Success',
            message: 'Create successfully'
        });
    } catch (error) {
        return res.status(500).json(error);
    }
};

exports.deleteSale = async (req, res) => {
    try {
        const { id } = req.params;
        const products = await ProductModel.find({ sale: id });
        if (products.length > 0) {
            for (let product of products) {
                await ProductModel.updateOne(
                    { _id: product._id },
                    { $set: { sale: null } }
                );
            }
        }
        await SaleModel.deleteOne({ _id: id });
        return res.status(200).json({
            status: 'success',
            message: 'Delete Successfully'
        });
    } catch (error) {
        return res.status(500).json(error);
    }
};
