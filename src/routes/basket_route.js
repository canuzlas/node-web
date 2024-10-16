const route = require('express').Router();
const userCheckMw = require('../middlewares/userCheck');
const userController = require('../controllers/basket_controller');
const formValidateMw = require('../middlewares/formValidatesMW');

route.get('/', userCheckMw.userCheck, userController.showBasketPage)
route.get('/step1', userCheckMw.userCheck, userController.showBasketStep1Page)
route.get('/siparislerim', userCheckMw.userCheck, userController.showSiparislerimPage)
route.get('/siparisdetaydata/:siparisid', userCheckMw.userCheck, userController.siparisDetay)

route.post('/', userCheckMw.userCheck, userController.addProductToBasket)
route.post('/removeitemfrombasket', userCheckMw.userCheck, userController.removeİtemFromBasket)

route.post('/paypage', userCheckMw.userCheck, formValidateMw.payformValidate(), userController.payPage)
route.post('/paycallback', userController.paycallback)




module.exports = route