const config = require('config');
const CommentModel = require(config.get('path.models.comment'));
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
        const comments = await CommentModel.find(query)
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
                docs: comments,
                pages: await paginaton(CommentModel, query, page, limit)
            }
        });
    } catch (error) {
        return res.status(500).json(error);
    }
};

exports.deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        await CommentModel.deleteOne({ _id: id });
        return res.status(200).json({
            status: 'Success',
            message: 'Delete Successfully'
        });
    } catch (error) {
        return res.status(500).json(error);
    }
};

exports.hideComment = async (req, res) => {
    try {
        const { id } = req.params;
        //
        await CommentModel.updateOne({ _id: id }, { $set: { status: 'hide' } });
        //
        return res.status(200).json({
            status: 'Success',
            message: 'Hide Successfully'
        });
    } catch (error) {
        return res.status(500).json(error);
    }
};

exports.showComment = async (req, res) => {
    try {
        const { id } = req.params;
        //
        await CommentModel.updateOne({ _id: id }, { $set: { status: 'show' } });
        //
        return res.status(200).json({
            status: 'Success',
            message: 'Show Successfully'
        });
    } catch (error) {
        return res.status(500).json(error);
    }
};
