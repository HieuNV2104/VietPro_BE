const config = require('config');
const bcrypt = require('bcrypt');
const CustomerModel = require(config.get('path.models.customer'));

exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { body } = req;
        //
        const isPhone = await CustomerModel.findOne({ phone: body.phone });
        //
        if (isPhone && isPhone._id.toString() !== id) {
            return res.status(400).json('Phone exists!');
        }
        if (
            (body.password && !body.new_password) ||
            (!body.password && body.new_password)
        ) {
            return res.status(400).json('Blank password!');
        }
        if (body.password && body.new_password) {
            let passwordCheck = null;
            if (!isPhone) {
                passwordCheck = (await CustomerModel.findById(id)).password;
            } else {
                passwordCheck = isPhone.password;
            }
            const isMatch = await bcrypt.compare(body.password, passwordCheck);
            if (!isMatch) {
                return res.status(400).json('Wrong password!');
            }
        }
        //
        const customer = {
            fullName: body.fullName,
            phone: body.phone,
            address: body.address,
            password: body.new_password
                ? await bcrypt.hash(body.new_password, 10)
                : isPhone.password
        };
        await CustomerModel.updateOne({ _id: id }, { $set: customer });
        return res.status(200).json({
            status: 'success',
            message: 'Update successfully!'
        });
    } catch (error) {
        return res.status(500).json(error);
    }
};
