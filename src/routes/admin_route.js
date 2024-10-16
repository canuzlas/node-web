const route = require('express').Router();
const adminController = require('../controllers/admin_controller');
const adminCheck = require('../middlewares/adminCheck');
const validationMW = require('../middlewares/formValidatesMW')
const update = require('../config/multer_config');

route.get('/panel-login', adminController.PanelLoginPageShow)
route.get('/panel', adminCheck.adminCheck, adminController.showAdminPanel)
route.get('/logout', adminCheck.adminCheck, adminController.adminLogout)
route.get('/me', adminCheck.adminCheck, adminController.showAdminProfile)
route.get('/delete-me', adminCheck.adminCheck, adminController.deleteMe)
route.get('/users', adminCheck.adminCheck, adminController.showUsersPage)
route.get('/delete-user/:id', adminCheck.adminCheck, adminController.deleteUserById)
route.get('/delete-product/:id', adminCheck.adminCheck, adminController.deleteProductById)
route.get('/show-product/:id', adminCheck.adminCheck, adminController.showThisProductPage)
route.get('/update-user/:id', adminCheck.adminCheck, adminController.showAndUpdateUserPage)
route.get('/urunler', adminCheck.adminCheck, adminController.showProducts)
route.get('/headersettings', adminCheck.adminCheck, adminController.showHeaderAllSettings)
route.get('/show-header-setting/:id', adminCheck.adminCheck, adminController.showHeaderOneSetting)
route.get('/slidersettings', adminCheck.adminCheck, adminController.showSliderAllSettings)
route.get('/show-slider/:id', adminCheck.adminCheck, adminController.showSliderOneSettings)
route.get('/categoryes', adminCheck.adminCheck, adminController.showCategoryesSettings)
route.get('/delete-category/:id', adminCheck.adminCheck, adminController.deleteCategory)
route.get('/show-category/:id', adminCheck.adminCheck, adminController.showOneCategory)

route.post('/panel-login', adminController.loginAdminPanel)
route.post('/update-profile/:id?', adminCheck.adminCheck, update.userMulter.single('avatar') , adminController.updateAdminProfile)
route.post('/add-user', adminCheck.adminCheck, validationMW.registerValidate(), adminController.addUser)
route.post('/add-product', adminCheck.adminCheck, update.productMulter.single('urunFoto'), adminController.addProduct)
route.post('/update-product/:id', adminCheck.adminCheck, update.productMulter.single('urunFoto'), adminController.updateProduct)
route.post('/update-setting/:id', adminCheck.adminCheck, update.userMulter.single('headerSettingLink'), adminController.updateHeaderOneSetting)
route.post('/update-slider/:id', adminCheck.adminCheck, update.sliderMulter.single('sliderFoto'), adminController.updateSliderOneSetting) 
route.post('/add-category', adminCheck.adminCheck, adminController.addCategory)
route.post('/update-category/:id', adminCheck.adminCheck, adminController.updateCategory)


module.exports = route