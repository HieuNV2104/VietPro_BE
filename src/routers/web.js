const express = require('express');
const router = express.Router();
const config = require('config');
const passport = require('passport');

// import middlewares
const authMiddlewares = require(config.get('path.middlewares.auth'));
const uploadMiddlewares = require(config.get('path.middlewares.upload'));

// import site controllers
const categorySiteController = require(config.get(
    'path.controllers.site.category'
));
const orderSiteController = require(config.get('path.controllers.site.order'));
const productSiteController = require(config.get(
    'path.controllers.site.product'
));
const slideSiteController = require(config.get('path.controllers.site.slide'));
const bannerSiteController = require(config.get(
    'path.controllers.site.banner'
));
const customerSiteController = require(config.get(
    'path.controllers.site.customer'
));
const authSiteController = require(config.get('path.controllers.site.auth'));
const paymentSiteController = require(config.get(
    'path.controllers.site.payment'
));

// import admin controllers
const productAdminController = require(config.get(
    'path.controllers.admin.product'
));
const categoryAdminController = require(config.get(
    'path.controllers.admin.category'
));
const userAdminController = require(config.get('path.controllers.admin.user'));
const customerAdminController = require(config.get(
    'path.controllers.admin.customer'
));
const commentAdminController = require(config.get(
    'path.controllers.admin.comment'
));
const bannerAdminController = require(config.get(
    'path.controllers.admin.banner'
));
const slideAdminController = require(config.get(
    'path.controllers.admin.slide'
));
const saleAdminController = require(config.get('path.controllers.admin.sale'));
const orderAdminController = require(config.get(
    'path.controllers.admin.order'
));
const authAdminController = require(config.get('path.controllers.admin.auth'));

// router site
// vn pay
router.post(
    '/createPayment',
    // authMiddlewares.verifyAuthentication,
    paymentSiteController.createPayment
);
router.get(
    '/vnpay_return',
    // authMiddlewares.verifyAuthentication,
    paymentSiteController.returnPayment
);
// update customer
router.post(
    '/customers/:id/update',
    authMiddlewares.verifyAuthentication,
    customerSiteController.update
);
// get slides
router.get('/slides', slideSiteController.index);
// get banners
router.get('/banners', bannerSiteController.index);
// get categories
router.get('/categories', categorySiteController.index);
// get category
router.get('/categories/:id', categorySiteController.show);
// get products by category
router.get('/categories/:id/products', categorySiteController.categoryProducts);
// order
router.post(
    '/order',
    authMiddlewares.verifyAuthentication,
    orderSiteController.order
);
// get orders by customer_id
router.get(
    '/customers/:id/orders',
    authMiddlewares.verifyAuthentication,
    orderSiteController.index
);
// get order
router.get(
    '/customers/orders/:id',
    authMiddlewares.verifyAuthentication,
    orderSiteController.show
);
// cancel order
router.patch(
    '/orders/:id/cancel',
    authMiddlewares.verifyAuthentication,
    orderSiteController.cancelOrder
);
// get products
router.get('/products', productSiteController.index);
// get product detail
router.get('/products/:id', productSiteController.show);
// get comment
router.get('/products/:id/comments', productSiteController.comments);
// create comment
router.post('/products/:id/comments', productSiteController.storeComment);
// get sale
router.get('/sales/:id', productSiteController.getSale);
// login customer
router.post('/customers/login', authSiteController.loginCustomer);
// register customer
router.post('/customers/register', authSiteController.registerCustomer);
// logout customer
router.post(
    '/customers/logout',
    authMiddlewares.verifyAuthentication,
    authSiteController.logoutCustomer
);
// forgot password
router.post('/customer/forgotPassword/otp', authSiteController.getOtp); // get otp
router.post('/customer/forgotPassword/checkOtp', authSiteController.checkOtp); // check otp
router.post(
    '/customer/forgotPassword/updateNewPassword',
    authSiteController.updateNewPassword
); // update new password
// refreshToken
router.get('/customer/refreshToken', authSiteController.refreshToken);
// login facebook
router.get(
    '/login/facebook',
    passport.authenticate('facebook', { scope: 'email' })
);
router.get(
    '/auth/facebook/callback',
    passport.authenticate('facebook'),
    authSiteController.loginOAuth
);
// login google
router.get('/login/google', passport.authenticate('google'));
router.get(
    '/auth/google/callback',
    passport.authenticate('google'),
    authSiteController.loginOAuth
);

//
// router admin
// login adminadmin
router.post('/admin/login', authAdminController.loginUser);
// logout admin
router.post(
    '/admin/logout',
    authMiddlewares.verifyAuthentication,
    authAdminController.logoutUser
);
// refresh token admin
router.get('/admin/refreshToken', authAdminController.refreshToken);
// get products
router.get(
    '/admin/products',
    authMiddlewares.verifyAuthentication,
    productAdminController.index
);
// get product
router.get(
    '/admin/products/:id',
    authMiddlewares.verifyAuthentication,
    productAdminController.show
);
// create product
router.post(
    '/admin/products/create',
    authMiddlewares.verifyAuthentication,
    uploadMiddlewares.single('image'),
    productAdminController.createProduct
);
// update product
router.post(
    '/admin/products/:id/update',
    authMiddlewares.verifyAuthentication,
    uploadMiddlewares.single('image'),
    productAdminController.updateProduct
);
// delete producut
router.get(
    '/admin/products/:id/delete',
    authMiddlewares.verifyAuthentication,
    productAdminController.deleteProduct
);
// get categories
router.get(
    '/admin/categories',
    authMiddlewares.verifyAuthentication,
    categoryAdminController.index
);
// get category
router.get(
    '/admin/categories/:id',
    authMiddlewares.verifyAuthentication,
    categoryAdminController.show
);
// create category
router.post(
    '/admin/categories/create',
    authMiddlewares.verifyAuthentication,
    categoryAdminController.createCategory
);
// update category
router.post(
    '/admin/categories/:id/update',
    authMiddlewares.verifyAuthentication,
    categoryAdminController.updateCategory
);
// delete category
router.get(
    '/admin/categories/:id/delete',
    authMiddlewares.verifyAuthentication,
    categoryAdminController.deleteCategory
);
// get users
router.get(
    '/admin/users',
    authMiddlewares.verifyAuthentication,
    userAdminController.index
);
// get user
router.get(
    '/admin/users/:id',
    authMiddlewares.verifyAuthentication,
    userAdminController.show
);
// create user
router.post(
    '/admin/users/create',
    authMiddlewares.verifyAuthentication,
    userAdminController.createUser
);
// update user
router.post(
    '/admin/users/:id/update',
    authMiddlewares.verifyAuthentication,
    userAdminController.updateUser
);
// delete user
router.get(
    '/admin/users/:id/delete',
    authMiddlewares.verifyAuthentication,
    userAdminController.deleteUser
);
// get customers
router.get(
    '/admin/customers',
    authMiddlewares.verifyAuthentication,
    customerAdminController.index
);
// delete customer
router.get(
    '/admin/customers/:id/delete',
    authMiddlewares.verifyAuthentication,
    customerAdminController.deleteCustomer
);
// get comments
router.get(
    '/admin/comments',
    authMiddlewares.verifyAuthentication,
    commentAdminController.index
);
// delete comment
router.get(
    '/admin/comments/:id/delete',
    authMiddlewares.verifyAuthentication,
    commentAdminController.deleteComment
);
// hide comment
router.patch(
    '/admin/commnets/:id/hide',
    authMiddlewares.verifyAuthentication,
    commentAdminController.hideComment
);
// show commnet
router.patch(
    '/admin/commnets/:id/show',
    authMiddlewares.verifyAuthentication,
    commentAdminController.showComment
);
// get bannners
router.get(
    '/admin/banners',
    authMiddlewares.verifyAuthentication,
    bannerAdminController.index
);
// get banner
router.get(
    '/admin/banners/:id',
    authMiddlewares.verifyAuthentication,
    bannerAdminController.show
);
// create banner
router.post(
    '/admin/banners/create',
    authMiddlewares.verifyAuthentication,
    uploadMiddlewares.single('image'),
    bannerAdminController.createBanner
);
// update banner
router.post(
    '/admin/banners/:id/update',
    authMiddlewares.verifyAuthentication,
    uploadMiddlewares.single('image'),
    bannerAdminController.updateBanner
);
// delete banner
router.get(
    '/admin/banners/:id/delete',
    authMiddlewares.verifyAuthentication,
    bannerAdminController.deleteBanner
);
// hide banner
router.patch(
    '/admin/banners/:id/hide',
    authMiddlewares.verifyAuthentication,
    bannerAdminController.hideBanner
);
// show banner
router.patch(
    '/admin/banners/:id/show',
    authMiddlewares.verifyAuthentication,
    bannerAdminController.showBanner
);
// get slides
router.get(
    '/admin/slides',
    authMiddlewares.verifyAuthentication,
    slideAdminController.index
);
// get slide
router.get(
    '/admin/slides/:id',
    authMiddlewares.verifyAuthentication,
    slideAdminController.show
);
// create slide
router.post(
    '/admin/slides/create',
    authMiddlewares.verifyAuthentication,
    uploadMiddlewares.single('image'),
    slideAdminController.createSlide
);
// update slide
router.post(
    '/admin/slides/:id/update',
    authMiddlewares.verifyAuthentication,
    uploadMiddlewares.single('image'),
    slideAdminController.updateSlide
);
// delete slide
router.get(
    '/admin/slides/:id/delete',
    authMiddlewares.verifyAuthentication,
    slideAdminController.deleteSlide
);
// hide slide
router.patch(
    '/admin/slides/:id/hide',
    authMiddlewares.verifyAuthentication,
    slideAdminController.hideSlide
);
// show slide
router.patch(
    '/admin/slides/:id/show',
    authMiddlewares.verifyAuthentication,
    slideAdminController.showSlide
);
// get sales
router.get(
    '/admin/sales',
    authMiddlewares.verifyAuthentication,
    saleAdminController.index
);
// get sale
router.get(
    '/admin/sales/:id',
    authMiddlewares.verifyAuthentication,
    saleAdminController.show
);
// create sale
router.post(
    '/admin/sales/create',
    authMiddlewares.verifyAuthentication,
    saleAdminController.createSale
);
// update sale
router.post(
    '/admin/sales/:id/update',
    authMiddlewares.verifyAuthentication,
    saleAdminController.updateSale
);
// delete sale
router.get(
    '/admin/sales/:id/delete',
    authMiddlewares.verifyAuthentication,
    saleAdminController.deleteSale
);
// get orders
router.get(
    '/admin/orders',
    authMiddlewares.verifyAuthentication,
    orderAdminController.index
);
// get order details
router.get(
    '/admin/orders/:id',
    authMiddlewares.verifyAuthentication,
    orderAdminController.show
);
// confirm order
router.patch(
    '/admin/orders/:id/confirm',
    authMiddlewares.verifyAuthentication,
    orderAdminController.confirmOrder
);
// delivered order
router.patch(
    '/admin/orders/:id/delivered',
    authMiddlewares.verifyAuthentication,
    orderAdminController.deliveredOrder
);
// done order
router.patch(
    '/admin/orders/:id/done',
    authMiddlewares.verifyAuthentication,
    orderAdminController.doneOrder
);

// test
router.get('/test', authMiddlewares.verifyAuthentication, (req, res) => {
    return res.status(200).json('ok');
});

module.exports = router;
