const router = require('express').Router();
const c = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/stats', c.stats);
router.get('/recent', c.recent);

module.exports = router;
