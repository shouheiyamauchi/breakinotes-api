const express = require('express');
const bodyParser = require('body-parser');
const practiceItemController = require('../controllers/practiceItem');
const passport = require('../middleware/auth');

const router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));

// router.use(passport.initialize());
// router.use(passport.authenticate('jwt', { session: false }));

router.post('/', practiceItemController.create);
router.get('/', practiceItemController.list);
router.post('/filter', practiceItemController.filter);
router.get('/:id', practiceItemController.get);
router.put('/:id', practiceItemController.update);
router.delete('/:id', practiceItemController.delete);

module.exports = router;
