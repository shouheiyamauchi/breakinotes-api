const express = require('express');
const bodyParser = require('body-parser');
const s3Controller = require('./s3Controller');

const router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));

router.post('/url-with-token', s3Controller.urlWithToken);
router.post('/signed-url', s3Controller.signedUrl);
router.post('/delete', s3Controller.delete);

module.exports = router;
