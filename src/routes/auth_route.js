const route = require('express').Router()
const authController = require('../controllers/auth_controller')
const defaultController = require('../controllers/default_controller')
const formValidateMW = require('../middlewares/formValidatesMW')

route.get('/', defaultController.showIndexPage)
route.get('/shop', defaultController.showShopPage)
route.get('/shop/category/:category', defaultController.showShopCategoryPage)
route.get('/login', authController.showLoginPage)
route.get('/forgot', authController.showForgotPage)
route.get('/verifyEmail', authController.verifyEmail)
route.get('/new-pass/:id/:token', authController.newPassPageShow)
route.get('/new-pass', authController.newPassPageShow)
route.get('/check/:check?', authController.loginCheckPageShow)

route.post('/check/:check?', authController.loginCheckPageShow)
route.post('/register-me', formValidateMW.registerValidate(), authController.registerMe)
route.post('/login', formValidateMW.loginValidate(), authController.login) 
route.post('/reset-my-pass', formValidateMW.forgotValidate(), authController.forgotMyPass)
route.post('/new-pass', formValidateMW.forgotPassValidate(), authController.newPass)

route.post('/registerBulten', formValidateMW.bultenEmailCheck(), defaultController.registerBulten)

module.exports = route