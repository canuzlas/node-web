const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user_model');
const bcrypt = require('bcrypt');

module.exports = function (passport) {
    const options = {
        usernameField: 'email',
        passwordField: 'pass'
    };
    passport.use(new LocalStrategy(options, async (email, pass, done) => {
        
            const _bulunanUser = await User.findOne({ email: email });

            if (!_bulunanUser) {
                return done(null, false,{ message: 'Girdiğiniz bilgiler hatalı.!' });
            }

            const sonuc = await bcrypt.compare(pass,_bulunanUser.pass);
            if (!sonuc) {
                return done(null, false, { message: 'Girdiğiniz bilgiler hatalı.!' });
            } else {

                if (_bulunanUser && _bulunanUser.aktif === false) {
                    return done(null, false, { message: 'Lütfen emailinizi onaylayın.!' });
                }else{
                    return done(null,_bulunanUser,{});
                }    
            }

    }));

    passport.serializeUser(function (user, cb) {
        cb(null, user._id);
    });

    passport.deserializeUser(function (id, cb) {
        User.findById(id, function (err, user) {
            cb(err, user);
        });
    });


}