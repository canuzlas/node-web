const router = require('express').Router();
const authGoogleController = require('../controllers/auth_google_controller')

router.get('/', authGoogleController.showGoogleLoginPage);
router.get('/callback', authGoogleController.loginWithGoogle);

module.exports = router