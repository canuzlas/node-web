const route = require('express').Router();
const adminController = require('../controllers/admin_controller');
const adminCheck = require('../middlewares/adminCheck');
const validationMW = require('../middlewares/formValidatesMW')
const update = require('../config/multer_config');

route.get('/panel', adminCheck.adminCheck, adminController.showAdminPanel)
route.get('/logout', adminCheck.adminCheck, adminController.adminLogout)
route.get('/me', adminCheck.adminCheck, adminController.showAdminProfile)
route.get('/delete-me', adminCheck.adminCheck, adminController.deleteMe)
route.get('/users', adminCheck.adminCheck, adminController.showUsersPage)
route.get('/delete-user/:id', adminCheck.adminCheck, adminController.deleteUserById)
route.get('/update-user/:id', adminCheck.adminCheck, adminController.showAndUpdateUserPage)




route.post('/update-profile/:id?', adminCheck.adminCheck, update.single('avatar') , adminController.updateAdminProfile)

route.post('/add-user', adminCheck.adminCheck, validationMW.registerValidate(), adminController.addUser)


module.exports = route