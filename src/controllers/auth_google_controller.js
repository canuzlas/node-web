const passport = require('passport');
require('../config/passport_google')(passport);

const showGoogleLoginPage = passport.authenticate('google', { scope: ['profile', 'email'], prompt: "select_account" })

const loginWithGoogle = async (req, res) => {
    passport.authenticate('google', { failureRedirect: '/login', successRedirect: '/admin/panel' ,failureFlash: true })(req, res) 
}

module.exports = {
    showGoogleLoginPage,
    loginWithGoogle
}