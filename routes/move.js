const express = require('express');
const bodyParser = require('body-parser');
const moveController = require('../controllers/move');
const passport = require('../middleware/auth');

const router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));

router.use(passport.initialize());
router.use(passport.authenticate('jwt', { session: false }));

router.post('/', moveController.create);
router.get('/', moveController.list);
router.post('/filter', moveController.filter);
router.get('/:id', moveController.get);
router.put('/:id', moveController.update);
router.delete('/:id', moveController.delete);
router.post('/suggestions', moveController.suggestions);

module.exports = router;
