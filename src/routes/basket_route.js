const route = require('express').Router();
const userCheckMw = require('../middlewares/userCheck');
const userController = require('../controllers/basket_controller');
const formValidateMw = require('../middlewares/formValidatesMW');

route.get('/', userCheckMw.userCheck, userController.showBasketPage)
route.get('/step1', userCheckMw.userCheck, userController.showBasketStep1Page)

route.post('/', userCheckMw.userCheck, userController.addProductToBasket)
route.post('/removeitemfrombasket', userCheckMw.userCheck, userController.removeİtemFromBasket)
route.post('/paypage', userCheckMw.userCheck, formValidateMw.payformValidate(), userController.payPage)
route.post('/paycallback', userCheckMw.userCheck, userController.paycallback)


module.exports = route