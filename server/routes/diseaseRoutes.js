const router = require('express').Router();
const c = require('../controllers/diseaseController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/', c.list);
router.get('/:id', c.getOne);

module.exports = router;
