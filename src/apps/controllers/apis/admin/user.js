const config = require('config');
const bcrypt = require('bcrypt');
const UserModel = require(config.get('path.models.user'));
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
        const users = await UserModel.find(query)
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
                docs: users,
                pages: await paginaton(UserModel, query, page, limit)
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
        const user = await UserModel.findById(id).select('-password');
        //
        return res.status(200).json({
            status: 'Success',
            data: {
                docs: user
            }
        });
    } catch (error) {
        return res.status(500).json(error);
    }
};

exports.createUser = async (req, res) => {
    try {
        const { full_name, email, password, role } = req.body;
        //
        const isUser = await UserModel.findOne({ email });
        if (isUser) {
            return res.status(400).json('User exists!');
        }
        const user = {
            full_name,
            email,
            password: await bcrypt.hash(password, 10),
            role
        };
        await UserModel(user).save();
        return res.status(200).json({
            status: 'Success',
            message: 'Create successfully'
        });
    } catch (error) {
        return res.status(500).json(error);
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { full_name, email, password, new_password, role } = req.body;
        //
        if ((password && !new_password) || (!password && new_password)) {
            return res.status(400).json('Blank password!');
        }
        const passwordCheck = (await UserModel.findById(id)).password;
        if (password && new_password) {
            const isMatch = await bcrypt.compare(password, passwordCheck);
            if (!isMatch) {
                return res.status(400).json('Wrong password!');
            }
        }
        //
        const user = {
            full_name,
            email,
            password: new_password
                ? await bcrypt.hash(new_password, 10)
                : passwordCheck,
            role
        };
        await UserModel.updateOne({ _id: id }, { $set: user });
        return res.status(200).json({
            status: 'Success',
            message: 'Update successfully'
        });
    } catch (error) {
        return res.status(500).json(error);
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await UserModel.deleteOne({ _id: id });
        return res.status(200).json({
            status: 'Success',
            message: 'Delete Successfully'
        });
    } catch (error) {
        return res.status(500).json(error);
    }
};
