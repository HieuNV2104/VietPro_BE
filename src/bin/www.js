const config = require('config');
const app = require(config.get('path.core.app'));
const server = app.listen((port = config.get('app.port')), (req, res) => {
    console.log(`Server running on port ${port}`);
});
