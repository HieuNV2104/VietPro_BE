const config = require('config');
const multer = require('multer');
const upload = multer({ dest: config.get('path.core.tmpFolder') });

module.exports = upload;
