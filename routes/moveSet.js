const express = require('express');
const bodyParser = require('body-parser');
const moveSetController = require('../controllers/moveSet');
const passport = require('../middleware/auth');

const router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));

router.use(passport.initialize());
router.use(passport.authenticate('jwt', { session: false }));

router.post('/', moveSetController.create);
router.get('/', moveSetController.list);
router.post('/filter', moveSetController.filter);
router.get('/:id', moveSetController.get);
router.put('/:id', moveSetController.update);
router.delete('/:id', moveSetController.delete);

module.exports = router;
