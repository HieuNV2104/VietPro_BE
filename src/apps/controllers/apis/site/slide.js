const config = require('config');
const SlideModel = require(config.get('path.models.slide'));

exports.index = async (req, res) => {
    try {
        const limit = +req.query.limit || 6;
        const sort = +req.query.sort || -1;
        //
        const slides = await SlideModel.find({ status: 'show' })
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
                docs: slides
            }
        });
    } catch (error) {
        return res.status(500).json(error);
    }
};
