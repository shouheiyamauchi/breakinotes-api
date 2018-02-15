const express = require('express');
const bodyParser = require('body-parser');
const userController = require('./userController');

const router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));

router.post('/login', userController.login);

module.exports = router;
