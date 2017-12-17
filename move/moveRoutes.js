const express = require('express');
const bodyParser = require('body-parser');
const moveController = require('./moveController');

const router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));

router.post('/', moveController.create);
router.get('/', moveController.list);
router.get('/:id', moveController.get);
router.put('/:id', moveController.update);
router.delete('/:id', moveController.delete);

module.exports = router;
