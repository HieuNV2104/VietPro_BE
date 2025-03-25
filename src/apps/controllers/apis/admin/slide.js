const config = require('config');
const SliderModel = require(config.get('path.models.slide'));
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
        const slides = await SliderModel.find(query)
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
                docs: slides,
                pages: await paginaton(SliderModel, query, page, limit)
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
        const slide = await SliderModel.findById(id);
        //
        return res.status(200).json({
            status: 'Success',
            data: {
                docs: slide
            }
        });
    } catch (error) {
        return res.status(500).json(error);
    }
};

exports.createSlide = async (req, res) => {
    try {
        const { file } = req;
        // insert DB
        const slide = {};
        if (file) {
            const image = file.originalname;
            fs.renameSync(
                file.path,
                path.resolve('src/public/uploads/images/sliders', image)
            );
            slide.image = image;
            await SliderModel(slide).save();
            return res.status(200).json({
                status: 'success',
                message: 'Create Successfully'
            });
        }
    } catch (error) {
        return res.status(500).json(error);
    }
};

exports.updateSlide = async (req, res) => {
    try {
        const { id } = req.params;
        const { body, file } = req;

        // insert DB
        const slide = { image: body.image || null };
        if (file || slide.image) {
            if (file) {
                const image = file.originalname;
                fs.renameSync(
                    file.path,
                    path.resolve('src/public/uploads/images/sliders', image)
                );
                slide.image = image;
            }
            await SliderModel.updateOne({ _id: id }, { $set: slide });
            return res.status(200).json({
                status: 'success',
                message: 'Update Successfully'
            });
        }
    } catch (error) {
        return res.status(500).json(error);
    }
};

exports.deleteSlide = async (req, res) => {
    try {
        const { id } = req.params;
        await SliderModel.deleteOne({ _id: id });
        return res.status(200).json({
            status: 'success',
            message: 'Delete Successfully'
        });
    } catch (error) {
        return res.status(500).json(error);
    }
};

exports.hideSlide = async (req, res) => {
    try {
        const { id } = req.params;
        //
        await SliderModel.updateOne({ _id: id }, { $set: { status: 'hide' } });
        //
        return res.status(200).json({
            status: 'Success',
            message: 'Hide Successfully'
        });
    } catch (error) {
        return res.status(500).json(error);
    }
};

exports.showSlide = async (req, res) => {
    try {
        const { id } = req.params;
        //
        await SliderModel.updateOne({ _id: id }, { $set: { status: 'show' } });
        //
        return res.status(200).json({
            status: 'Success',
            message: 'Show Successfully'
        });
    } catch (error) {
        return res.status(500).json(error);
    }
};
