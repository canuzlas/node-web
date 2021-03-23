const router = require('express').Router();
const apiController = require('../controllers/api_controller');

router.get('/', apiController.showApiIndexPage)
router.get('/users/:id?', apiController.getAllUsers)


module.exports = router