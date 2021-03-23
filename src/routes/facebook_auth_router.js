const router = require('express').Router();
const authFacebookController = require('../controllers/auth_facebook_controller');

router.get("/", authFacebookController.loginPageWithFacebook);
router.get("/callback", authFacebookController.loginWithFacebook);

module.exports = router