const config = require('config');
const ProductModel = require(config.get('path.models.product'));
const paginaton = require(config.get('path.libs.pagination'));
const fs = require('fs');
const path = require('path');

exports.index = async (req, res) => {
    try {
        const query = {};
        const limit = +req.query.limit || 10;
        const page = +req.query.page || 1;
        const skip = page * limit - limit;
        let sort = { _id: -1 };
        //
        if (req.query.id) {
            query._id = req.query.id;
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

exports.createProduct = async (req, res) => {
    try {
        const { body, file } = req;
        // insert DB
        const product = {
            name: body.name,
            price: body.price,
            accessories: body.accessories,
            promotion: body.promotion,
            status: body.status,
            category_id: body.category_id,
            warranty: body.warranty,
            qty: body.qty,
            is_stock: body.qty > 0,
            is_featured: body.is_featured === 'true' || false,
            details: body.details,
            sale: body.sale || null
        };
        if (file) {
            const image = file.originalname;
            fs.renameSync(
                file.path,
                path.resolve('src/public/uploads/images/products', image)
            );
            product.image = image;
            await ProductModel(product).save();
            return res.status(200).json({
                status: 'success',
                message: 'Create Successfully'
            });
        }
    } catch (error) {
        return res.status(500).json(error);
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { body, file } = req;
        // insert DB
        const product = {
            image: body.image || null,
            name: body.name,
            price: body.price,
            accessories: body.accessories,
            promotion: body.promotion,
            status: body.status,
            category_id: body.category_id,
            warranty: body.warranty,
            qty: body.qty,
            is_stock: body.qty > 0,
            is_featured: body.is_featured === 'true' || false,
            details: body.details,
            sale: body.sale === 'null' ? null : body.sale
        };
        if (file || product.image) {
            if (file) {
                const image = file.originalname;
                fs.renameSync(
                    file.path,
                    path.resolve('src/public/uploads/images/products', image)
                );
                product.image = image;
            }
            await ProductModel.updateOne({ _id: id }, { $set: product });
            return res.status(200).json({
                status: 'success',
                message: 'Update Successfully'
            });
        }
    } catch (error) {
        return res.status(500).json(error);
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        await ProductModel.deleteOne({ _id: id });
        return res.status(200).json({
            status: 'success',
            message: 'Delete Successfully'
        });
    } catch (error) {
        return res.status(500).json(error);
    }
};
