const route = require('express').Router();
const userCheckMw = require('../middlewares/userCheck');
const userController = require('../controllers/basket_controller')

route.get('/', userCheckMw.userCheck, userController.showBasketPage)
route.post('/', userCheckMw.userCheck, userController.addProductToBasket)


module.exports = route