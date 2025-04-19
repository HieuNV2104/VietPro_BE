const config = require('config');
const CustomertModel = require(config.get('path.models.customer'));
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
        const customers = await CustomertModel.find(query)
            .sort({ _id: -1 })
            .skip(skip)
            .limit(limit)
            .select('-password');
        //
        return res.status(200).json({
            status: 'Success',
            filter: {
                limit,
                page
            },
            data: {
                docs: customers,
                pages: await paginaton(CustomertModel, query, page, limit)
            }
        });
    } catch (error) {
        return res.status(500).json(error);
    }
};

exports.deleteCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        await CustomertModel.deleteOne({ _id: id });
        return res.status(200).json({
            status: 'Success',
            message: 'Delete Successfully'
        });
    } catch (error) {
        return res.status(500).json(error);
    }
};
