const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('config');
const CustomerModel = require(config.get('path.models.customer'));
const CustomerTokenModel = require(config.get('path.models.customerToken'));
const { redisClient } = require(config.get('path.core.redis'));
const {
    createAccessToken,
    createRefreshToken,
    setTokenBlacklist
} = require(config.get('path.libs.handleToken'));
const transporter = require(config.get('path.libs.transporter'));
const ejs = require('ejs');

exports.loginCustomer = async (req, res) => {
    try {
        const { email, password } = req.body;
        //
        const isEmail = await CustomerModel.findOne({ email });
        if (!isEmail) {
            return res.status(400).json('email not valid');
        }
        const isMatch = await bcrypt.compare(password, isEmail.password);
        if (!isMatch) {
            return res.status(400).json('password not valid');
        }
        //
        if (isEmail && isMatch) {
            const { password, ...customer } = isEmail._doc;
            const accessToken = await createAccessToken(customer, 'customer');
            const refreshToken = await createRefreshToken(customer, 'customer');
            const isToken = await CustomerTokenModel.findOne({
                customerId: customer._id
            });
            if (isToken) {
                // move token to redis
                setTokenBlacklist(isToken.accessToken);
                setTokenBlacklist(isToken.refreshToken);
                // delete token from dtb
                await CustomerTokenModel.deleteOne({
                    customerId: customer._id
                });
            }
            await CustomerTokenModel({
                customerId: customer._id,
                accessToken,
                refreshToken
            }).save();
            res.cookie('refreshToken', refreshToken, { httpOnly: true });
            //
            return res.status(200).json({
                customer,
                accessToken
            });
        }
    } catch (error) {
        return res.status(500).json(error);
    }
};

exports.registerCustomer = async (req, res) => {
    try {
        const { fullName, email, phone, password, address } = req.body;
        //
        const isEmail = await CustomerModel.findOne({ email });
        if (isEmail) {
            return res.status(400).json('email exists');
        }
        const isPhone = await CustomerModel.findOne({ phone });
        if (isPhone) {
            return res.status(400).json('phone exists');
        }
        //
        if (!isEmail && !isPhone) {
            const customer = {
                fullName,
                email,
                phone,
                password: await bcrypt.hash(password, 10),
                address
            };
            await new CustomerModel(customer).save();
            //
            return res.status(200).json({
                status: 'Success',
                message: 'Customer Created Successfully'
            });
        }
    } catch (error) {
        return res.status(500).json(error);
    }
};

exports.logoutCustomer = async (req, res) => {
    try {
        const { accessToken } = req;
        const tokenCustomer = await CustomerTokenModel.findOne({ accessToken });
        // move token to redis
        setTokenBlacklist(tokenCustomer.accessToken);
        setTokenBlacklist(tokenCustomer.refreshToken);
        // delete token from dtb
        await CustomerTokenModel.deleteOne({ accessToken });
        return res.status(200).json('Logout Successfully');
    } catch (error) {
        return res.status(500).json(error);
    }
};

exports.refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.cookies;
        if (!refreshToken) {
            return res.status(401).json('authentication required');
        }
        const dirtyToken = await redisClient.get(refreshToken);
        if (dirtyToken) {
            return res.status(401).json('Token expired');
        }
        jwt.verify(
            refreshToken,
            config.get('app.jwtRefreshKey'),
            async (error, decoded) => {
                if (error) {
                    return res.status(401).json('authentication required');
                }
                const accessToken = await createAccessToken(
                    decoded,
                    'customer'
                );
                await CustomerTokenModel.updateOne(
                    { refreshToken },
                    { $set: { accessToken } }
                );
                //
                return res.status(200).json({
                    accessToken
                });
            }
        );
    } catch (error) {
        return res.status(500).json(error);
    }
};

exports.loginOAuth = async (req, res) => {
    try {
        let refreshToken = null;
        let accessToken = null;
        let customer = {};
        const data = req.session.passport.user;
        const email = data.emails[0].value;
        //
        const isEmail = await CustomerModel.findOne({ email });
        if (isEmail) {
            const { password, ...orther } = isEmail._doc;
            customer = orther;
            //
            accessToken = await createAccessToken(customer, 'customer');
            refreshToken = await createRefreshToken(customer, 'customer');
            const isToken = await CustomerTokenModel.findOne({
                customerId: customer._id
            });
            if (isToken) {
                // move token to redis
                setTokenBlacklist(isToken.accessToken);
                setTokenBlacklist(isToken.refreshToken);
                // delete token from dtb
                await CustomerTokenModel.deleteOne({
                    customerId: customer._id
                });
            }
        } else {
            let fullName = '';
            if (data.provider === 'google') {
                fullName = data.displayName;
            }
            if (data.provider === 'facebook') {
                fullName = `${data.name.familyName} ${data.name.middleName} ${data.name.givenName}`;
            }
            //
            const newPassword = await bcrypt.hash(data.id, 10);
            const savedCustomer = await CustomerModel({
                fullName,
                email,
                phone: 'default phone',
                address: 'default address',
                password: newPassword
            }).save();
            const { password, ...orther } = savedCustomer._doc;
            customer = orther;
            //
            accessToken = await createAccessToken(customer, 'customer');
            refreshToken = await createRefreshToken(customer, 'customer');
            // send mail
            const html = await ejs.renderFile(
                config.get('path.views.password'),
                {
                    password: data.id,
                    provider: data.provider,
                    color: data.provider === 'google' ? 'red' : 'blue'
                }
            );
            await transporter.sendMail({
                from: `VietPro Store" <${config.get('mail.auth.user')}>`,
                to: email,
                subject: 'Thông báo đăng nhập thành công',
                html
            });
        }
        //
        await CustomerTokenModel({
            customerId: customer._id,
            accessToken,
            refreshToken
        }).save();
        //
        res.cookie('refreshToken', refreshToken, { httpOnly: true });
        res.send(`
            <script>
                window.opener.postMessage({ success: true, customer: ${JSON.stringify(
                    customer
                )}, accessToken: '${accessToken}' }, '*');
                window.close();
            </script>
        `);
    } catch (error) {
        return res.status(500).json(error);
    }
};
