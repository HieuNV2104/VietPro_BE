const config = require('config');
const BannerModel = require(config.get('path.models.banner'));

exports.index = async (req, res) => {
    try {
        const limit = +req.query.limit || 6;
        const sort = +req.query.sort || -1;
        //
        const banners = await BannerModel.find({ status: 'show' })
            .limit(limit)
            .sort({ _id: sort });
        //
        return res.status(200).json({
            status: 'success',
            filters: {
                limit,
                sort
            },
            data: {
                docs: banners
            }
        });
    } catch (error) {
        return res.status(500).json(error);
    }
};
