const config = require('config');
var passport = require('passport');
// facebook
var FacebookStrategy = require('passport-facebook');
var GoogleStrategy = require('passport-google-oauth20');
passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

passport.use(
    new FacebookStrategy(
        {
            clientID: config.get('auth.facebookIdApp'),
            clientSecret: config.get('auth.facebookSecretKey'),
            callbackURL: '/api/v1/auth/facebook/callback',
            // state: true,
            profileFields: ['id', 'emails', 'name']
            // passReqToCallback: true
        },
        function verify(accessToken, refreshToken, profile, cb) {
            return cb(null, profile);
        }
    )
);

passport.use(
    new GoogleStrategy(
        {
            clientID: config.get('auth.googleIdApp'),
            clientSecret: config.get('auth.googleSecretKey'),
            callbackURL: '/api/v1/auth/google/callback',
            scope: ['profile', 'email', 'openid'],
            prompt: 'select_account'
        },
        function verify(accessToken, refreshToken, profile, cb) {
            return cb(null, profile);
        }
    )
);

module.exports = passport;
