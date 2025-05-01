const express = require('express');
const app = express();
const config = require('config');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const { connectionRedis } = require(config.get('path.core.redis'));
const passport = require(config.get('path.middlewares.passport'));
// url img
app.use(
    '/assets/uploads',
    express.static(config.get('path.core.baseImagesUrl'))
);
// cors
app.use(
    cors({
        origin: ['http://localhost:3000', 'https://vp-fe.vercel.app'],
        credentials: true
    })
);
app.options(
    '*',
    cors({
        origin: ['http://localhost:3000', 'https://vp-fe.vercel.app'],
        credentials: true
    })
);
//
connectionRedis();
app.use(cookieParser());
app.use(session(config.get('app.session')));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
//router
app.use(
    `${config.get('app.prefixApiVersion')}`,
    require(config.get('path.core.router'))
);
//
module.exports = app;
