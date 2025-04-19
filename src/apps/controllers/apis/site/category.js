const mongoose = require('mongoose');
const config = require('config');
const CategoryModel = require(config.get('path.models.category'));
const ProductModel = require(config.get('path.models.product'));
const paginaton = require(config.get('path.libs.pagination'));

// get categories
exports.index = async (req, res) => {
    try {
        const query = {};
        //
        const categories = await CategoryModel.find(query).sort({ _id: 1 });
        //
        return res.status(200).json({
            status: 'success',
            data: {
                docs: categories
            }
        });
    } catch (error) {
        return res.status(500).json(error);
    }
};

// get category
exports.show = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await CategoryModel.findById(id);

        return res.status(200).json({
            status: 'success',
            data: {
                docs: category
            }
        });
    } catch (error) {
        return res.status(500).json(error);
    }
};

// get products by category
exports.categoryProducts = async (req, res) => {
    try {
        const { id } = req.params;
        const query = {};
        const limit = +req.query.limit || 10;
        const page = +req.query.page || 1;
        const skip = page * limit - limit;
        let sort = { _id: -1 };

        if (req.query.sort) {
            let name = req.query.sort.split('v')[0];
            let value = req.query.sort.split('v')[1];
            sort = { [name]: +value };
        }

        if (req.query.is_featured) {
            query.is_featured = req.query.is_featured;
        }
        if (req.query.is_stock) {
            query.is_stock = req.query.is_stock;
        }
        query.category_id = new mongoose.Types.ObjectId(id);

        const category = await ProductModel.find(query)
            .sort(sort)
            .skip(skip)
            .limit(limit);

        return res.status(200).json({
            status: 'success',
            filters: {
                limit,
                page,
                category_id: id
            },
            data: {
                docs: category,
                pages: await paginaton(ProductModel, query, page, limit)
            }
        });
    } catch (error) {
        return res.status(500).json(error);
    }
};
