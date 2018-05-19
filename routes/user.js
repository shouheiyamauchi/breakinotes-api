const express = require('express');
const bodyParser = require('body-parser');
const userController = require('../controllers/user');
const passport = require('../middleware/auth');

const router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));

router.post('/login', userController.login);

router.use(passport.initialize());
router.use(passport.authenticate('jwt', { session: false }));

router.get('/checkAuthentication', userController.checkAuthentication);

module.exports = router;
