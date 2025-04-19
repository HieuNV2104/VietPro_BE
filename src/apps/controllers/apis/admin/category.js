const config = require('config');
const CategoryModel = require(config.get('path.models.category'));
const ProductModel = require(config.get('path.models.product'));
const paginaton = require(config.get('path.libs.pagination'));

exports.index = async (req, res) => {
    try {
        const query = {};
        const limit = +req.query.limit || 5;
        const page = +req.query.page || 1;
        const skip = page * limit - limit;
        //
        if (req.query.id) {
            query._id = req.query.id;
        }
        //
        const categories = await CategoryModel.find(query)
            .sort({ _id: 1 })
            .skip(skip)
            .limit(limit);
        //
        return res.status(200).json({
            status: 'success',
            data: {
                docs: categories,
                pages: await paginaton(CategoryModel, query, page, limit)
            }
        });
    } catch (error) {
        return res.status(500).json(error);
    }
};

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

exports.createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const isCategory = await CategoryModel.findOne({
            $text: { $search: name }
        });
        if (isCategory) {
            return res.status(400).json('Category exists!');
        }

        const category = {
            name
        };
        await CategoryModel(category).save();
        return res.status(200).json({
            status: 'Success',
            message: 'Create successfully'
        });
    } catch (error) {
        return res.status(500).json(error);
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const isCategory = await CategoryModel.findOne({
            $text: { $search: name }
        });
        if (isCategory && isCategory._id.toString() !== id) {
            return res.status(400).json('Category exists!');
        }

        const category = {
            name
        };
        await CategoryModel.updateOne({ _id: id }, { $set: category });
        return res.status(200).json({
            status: 'Success',
            message: 'Update successfully'
        });
    } catch (error) {
        return res.status(500).json(error);
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const isProduct = await ProductModel.findOne({ category_id: id });
        if (isProduct) {
            return res
                .status(400)
                .json('There are already products in this category!');
        }
        await CategoryModel.deleteOne({ _id: id });
        return res.status(200).json({
            status: 'Success',
            message: 'Delete Successfully'
        });
    } catch (error) {
        return res.status(500).json(error);
    }
};
