const facebookStratagy = require('passport-facebook').Strategy;
const User = require('../models/user_model');

module.exports = function (passport) {

    passport.use(
        new facebookStratagy( 
            {
                clientID: process.env.FACEBOOK_CLIENT_ID,
                clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
                callbackURL: process.env.FACEBOOK_CALLBACK_URL,
                profileFields: ["email", "name"]
            },
            async function (accessToken, refreshToken, profile, done) {
                const _user = await User.findOne({ email: profile.emails[0].value });
                if (_user) {
                    if (_user.aktif == false) {
                        return done(null, false, { message: 'Öncelikle mail adresinize gelen linke tıklayın.' })
                    }
                    return done(null, _user);
                } else {
                    
                    const _user = await new User({
                        ad: profile.name.givenName,
                        soyad: profile.name.familyName,
                        email: profile.emails[0].value,
                        authFacebook: true,
                        aktif: true
                    })
                    _user.save();
                    return done(null, _user);
                }
            }
        )
    );

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });

    });
}