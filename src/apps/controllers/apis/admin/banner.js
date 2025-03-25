const config = require('config');
const BannerModel = require(config.get('path.models.banner'));
const paginaton = require(config.get('path.libs.pagination'));
const fs = require('fs');
const path = require('path');

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
        const banners = await BannerModel.find(query)
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
                docs: banners,
                pages: await paginaton(BannerModel, query, page, limit)
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
        const banner = await BannerModel.findById(id);
        //
        return res.status(200).json({
            status: 'Success',
            data: {
                docs: banner
            }
        });
    } catch (error) {
        return res.status(500).json(error);
    }
};

exports.createBanner = async (req, res) => {
    try {
        const { file } = req;
        // insert DB
        const banner = {};
        if (file) {
            const image = file.originalname;
            fs.renameSync(
                file.path,
                path.resolve('src/public/uploads/images/banners', image)
            );
            banner.image = image;
            await BannerModel(banner).save();
            return res.status(200).json({
                status: 'success',
                message: 'Create Successfully'
            });
        }
    } catch (error) {
        return res.status(500).json(error);
    }
};

exports.updateBanner = async (req, res) => {
    try {
        const { id } = req.params;
        const { body, file } = req;

        // insert DB
        const banner = { image: body.image || null };
        if (file || banner.image) {
            if (file) {
                const image = file.originalname;
                fs.renameSync(
                    file.path,
                    path.resolve('src/public/uploads/images/banners', image)
                );
                banner.image = image;
            }
            await BannerModel.updateOne({ _id: id }, { $set: banner });
            return res.status(200).json({
                status: 'success',
                message: 'Update Successfully'
            });
        }
    } catch (error) {
        return res.status(500).json(error);
    }
};

exports.deleteBanner = async (req, res) => {
    try {
        const { id } = req.params;
        await BannerModel.deleteOne({ _id: id });
        return res.status(200).json({
            status: 'success',
            message: 'Delete Successfully'
        });
    } catch (error) {
        return res.status(500).json(error);
    }
};

exports.hideBanner = async (req, res) => {
    try {
        const { id } = req.params;
        //
        await BannerModel.updateOne({ _id: id }, { $set: { status: 'hide' } });
        //
        return res.status(200).json({
            status: 'Success',
            message: 'Hide Successfully'
        });
    } catch (error) {
        return res.status(500).json(error);
    }
};

exports.showBanner = async (req, res) => {
    try {
        const { id } = req.params;
        //
        await BannerModel.updateOne({ _id: id }, { $set: { status: 'show' } });
        //
        return res.status(200).json({
            status: 'Success',
            message: 'Show Successfully'
        });
    } catch (error) {
        return res.status(500).json(error);
    }
};
