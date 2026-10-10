const router = require('express').Router();
const c = require('../controllers/predictionController');
const { protect } = require('../middleware/auth');
const validateObjectId = require('../middleware/validateObjectId');

router.use(protect);
router.post('/', c.create);
router.get('/', c.list);
router.get('/:id', validateObjectId(), c.getOne);
router.get('/:id/report', validateObjectId(), c.report);
router.delete('/:id', validateObjectId(), c.remove);

module.exports = router;
