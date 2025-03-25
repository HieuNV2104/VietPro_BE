const config = require('config');
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport(config.get('mail'));
module.exports = transporter;
