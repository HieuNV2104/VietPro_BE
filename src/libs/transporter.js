const config = require('config');
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport(config.get('mail'));
//
module.exports = async (email, subject, html) => {
    await transporter.sendMail({
        from: `VietPro Store" <${config.get('mail.auth.user')}>`,
        to: email,
        subject,
        html
    });
};
