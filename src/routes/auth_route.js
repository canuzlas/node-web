const route = require('express').Router()
const authController = require('../controllers/auth_controller')
const formValidateMW = require('../middlewares/formValidatesMW')

route.get('/login', authController.showLoginPage)
route.get('/register', authController.showRegisterPage)
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

module.exports = route