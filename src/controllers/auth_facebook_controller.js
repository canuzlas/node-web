const passport = require('passport');
require('../config/passport_facebook')(passport);

const loginPageWithFacebook = passport.authenticate("facebook", { scope: ['public_profile', 'email'], auth_type: 'reauthenticate' });

const loginWithFacebook = (req, res) => {
    passport.authenticate("facebook", {
        successRedirect: "/admin/panel",
        failureRedirect: "/login",
        failureFlash: true
    })(req, res)
}

module.exports = {
    loginPageWithFacebook,
    loginWithFacebook
}