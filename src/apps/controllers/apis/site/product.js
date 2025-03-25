const config = require('config');
const ProductModel = require(config.get('path.models.product'));
const CommentModel = require(config.get('path.models.comment'));
const paginaton = require(config.get('path.libs.pagination'));

// get products
exports.index = async (req, res) => {
    try {
        const query = {};
        const limit = +req.query.limit || 10;
        const page = +req.query.page || 1;
        const skip = page * limit - limit;
        let sort = { _id: -1 };
        //
        if (req.query.sort) {
            let name = req.query.sort.split('v')[0];
            let value = req.query.sort.split('v')[1];
            sort = { [name]: +value };
        }
        //
        if (req.query.is_featured) {
            query.is_featured = req.query.is_featured;
        }
        if (req.query.is_stock) {
            query.is_stock = req.query.is_stock;
        }
        // if (req.query.name) {
        //     query.name = new RegExp(req.query.name, 'i');
        // }
        if (req.query.name) {
            query.$text = { $search: req.query.name };
        }
        //
        const products = await ProductModel.find(query)
            .sort(sort)
            .skip(skip)
            .limit(limit);
        //
        return res.status(200).json({
            status: 'success',
            filters: {
                is_featured: req.query.is_featured || null,
                is_stock: req.query.is_stock || null,
                page,
                limit
            },
            data: {
                docs: products,
                pages: await paginaton(ProductModel, query, page, limit)
            }
        });
    } catch (error) {
        return res.status(500).json(error);
    }
};

// get product detail
exports.show = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await ProductModel.findById(id);

        return res.status(200).json({
            status: 'success',
            data: {
                docs: product
            }
        });
    } catch (error) {
        return res.status(500).json(error);
    }
};

// get comments
exports.comments = async (req, res) => {
    try {
        const { id } = req.params;
        const query = {};
        const page = +req.query.page || 1;
        const limit = +req.query.limit || 10;
        const skip = page * limit - limit;

        query.product_id = id;
        query.status = 'show';

        const comments = await CommentModel.find(query)
            .sort({ _id: -1 })
            .skip(skip)
            .limit(limit);

        return res.status(200).json({
            status: 'success',
            filters: {
                product_id: id,
                page,
                limit
            },
            data: {
                docs: comments,
                pages: await paginaton(CommentModel, query, page, limit)
            }
        });
    } catch (error) {
        return res.status(500).json(error);
    }
};

// create comment
exports.storeComment = async (req, res) => {
    try {
        const { id } = req.params;
        const comment = req.body;
        comment.product_id = id;
        await CommentModel(comment).save();

        return res.status(200).json({
            status: 'success',
            data: comment
        });
    } catch (error) {
        return res.status(500).json(error);
    }
};
