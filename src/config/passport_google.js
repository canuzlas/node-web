const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const User = require('../models/user_model');
require('dotenv').config();

module.exports = function (passport){

    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL
    },
        async function (accessToken, refreshToken, profile, done) {
            userProfile = profile;
            const sonuc = await User.findOne({ email: userProfile.emails[0].value });
            if (sonuc) {
                if (sonuc.aktif == false) {
                    return done(null, false, { message: 'Öncellikle mail adresinize gelen linke tıklayın.' });
                }
                return done(null, sonuc);
            } else {
                const _user = await new User({ ad: userProfile.name.givenName, soyad: userProfile.name.familyName, email: userProfile.emails[0].value, aktif: true, authGoogle: true, aktif: true })
                _user.save();
                return done(null, _user);
            }

        }
    ));

    passport.serializeUser(function (user, cb) {
        cb(null, user._id);
    });

    passport.deserializeUser(function (id, cb) {
        User.findById(id, function (err, user) {
            cb(err, user);
        });
    });
 

}

