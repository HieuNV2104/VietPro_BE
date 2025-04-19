module.exports = {
    port: process.env.SERVER_PORT || 8000,
    prefixApiVersion: process.env.PREFIX_API_VERSION || '/api/v1',
    jwtAccessKey: process.env.JWT_ACCESS_KEY || 'VietPro_Access_Key',
    jwtRefreshKey: process.env.JWT_REFRESH_KEY || 'VietPro_Refresh_Key',
    session: {
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: true }
    }
};
