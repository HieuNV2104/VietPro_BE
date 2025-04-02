exports.core = {
    // app
    app: `${__dirname}/../src/apps/app`,
    // router
    router: `${__dirname}/../src/routers/web`,
    // mongodb
    mongodb: `${__dirname}/../src/common/database.mongo`,
    // redis
    redis: `${__dirname}/../src/common/redis.connect`,
    // images
    baseImagesUrl:
        process.env.BASE_IMAGES_URL ||
        `${__dirname}/../src/public/uploads/images/`,
    // tmp folder
    tmpFolder: `${__dirname}/../src/tmp`
};

exports.controllers = {
    admin: {
        auth: `${__dirname}/../src/apps/controllers/apis/admin/auth`,
        banner: `${__dirname}/../src/apps/controllers/apis/admin/banner`,
        category: `${__dirname}/../src/apps/controllers/apis/admin/category`,
        comment: `${__dirname}/../src/apps/controllers/apis/admin/comment`,
        customer: `${__dirname}/../src/apps/controllers/apis/admin/customer`,
        order: `${__dirname}/../src/apps/controllers/apis/admin/order`,
        product: `${__dirname}/../src/apps/controllers/apis/admin/product`,
        sale: `${__dirname}/../src/apps/controllers/apis/admin/sale`,
        slide: `${__dirname}/../src/apps/controllers/apis/admin/slide`,
        user: `${__dirname}/../src/apps/controllers/apis/admin/user`
    },
    site: {
        category: `${__dirname}/../src/apps/controllers/apis/site/category`,
        product: `${__dirname}/../src/apps/controllers/apis/site/product`,
        order: `${__dirname}/../src/apps/controllers/apis/site/order`,
        slide: `${__dirname}/../src/apps/controllers/apis/site/slide`,
        banner: `${__dirname}/../src/apps/controllers/apis/site/banner`,
        customer: `${__dirname}/../src/apps/controllers/apis/site/customer`,
        auth: `${__dirname}/../src/apps/controllers/apis/site/auth`,
        payment: `${__dirname}/../src/apps/controllers/apis/site/payment`
    }
};

exports.models = {
    product: `${__dirname}/../src/apps/models/product`,
    category: `${__dirname}/../src/apps/models/category`,
    comment: `${__dirname}/../src/apps/models/comment`,
    order: `${__dirname}/../src/apps/models/order`,
    customer: `${__dirname}/../src/apps/models/customer`,
    slide: `${__dirname}/../src/apps/models/slide`,
    banner: `${__dirname}/../src/apps/models/banner`,
    user: `${__dirname}/../src/apps/models/user`,
    sale: `${__dirname}/../src/apps/models/sale`,
    customerToken: `${__dirname}/../src/apps/models/customerToken`,
    userToken: `${__dirname}/../src/apps/models/userToken`
};

exports.views = {
    mail: `${__dirname}/../src/apps/views/mail.ejs`,
    password: `${__dirname}/../src/apps/views/password.ejs`
};

exports.middlewares = {
    auth: `${__dirname}/../src/apps/middlewares/auth`,
    upload: `${__dirname}/../src/apps/middlewares/upload`,
    passport: `${__dirname}/../src/apps/middlewares/passport`
};

exports.libs = {
    pagination: `${__dirname}/../src/libs/pagination`,
    transporter: `${__dirname}/../src/libs/transporter`,
    handleToken: `${__dirname}/../src/libs/handleToken`
};
