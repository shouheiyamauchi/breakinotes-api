const express = require('express');
const bodyParser = require('body-parser');
const s3Controller = require('../controllers/s3');
const passport = require('../middleware/auth');

const router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));

router.use(passport.initialize());
router.use(passport.authenticate('jwt', { session: false }));

router.post('/url-with-token', s3Controller.urlWithToken);
router.post('/signed-url', s3Controller.signedUrl);
router.post('/delete', s3Controller.delete);

module.exports = router;
