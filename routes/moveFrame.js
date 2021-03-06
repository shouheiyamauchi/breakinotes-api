const express = require('express');
const bodyParser = require('body-parser');
const moveFrameController = require('../controllers/moveFrame');
const passport = require('../middleware/auth');

const router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));

router.use(passport.initialize());
router.use(passport.authenticate('jwt', { session: false }));

router.post('/', moveFrameController.create);
router.get('/', moveFrameController.list);
router.post('/filter', moveFrameController.filter);
router.get('/:id', moveFrameController.get);
router.put('/:id', moveFrameController.update);
router.delete('/:id', moveFrameController.delete);
router.post('/touched', moveFrameController.touched);
router.post('/forceTouch/:id', moveFrameController.forceTouch);

module.exports = router;
