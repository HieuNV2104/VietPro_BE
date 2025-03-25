const config = require('config');
const customerModel = require(config.get('path.models.customer'));

exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { body } = req;
        //
        const isPhone = await customerModel.findOne({ phone: body.phone });
        //

        if (isPhone._id.toString() !== id) {
            return res.status(400).json('Phone exists!');
        }
        const customer = {
            fullName: body.fullName,
            phone: body.phone,
            address: body.address
        };
        await customerModel.updateOne({ _id: id }, { $set: customer });
        return res.status(200).json({
            status: 'success',
            message: 'Update successfully!'
        });
    } catch (error) {
        return res.status(500).json(error);
    }
};
