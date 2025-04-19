require('dotenv').config();

module.exports = {
    app: require('./app'),
    db: require('./db'),
    mail: require('./mail'),
    path: require('./path'),
    auth: require('./auth'),
    payment: require('./payment')
};
