const router = require('express').Router();
const c = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');
const validateObjectId = require('../middleware/validateObjectId');

// Every admin route requires a valid session AND the ADMIN role (checked against the database).
router.use(protect, authorize('ADMIN'));

router.get('/stats', c.stats);
router.get('/models', c.models);
router.get('/system', c.systemInfo);

router.get('/users', c.listUsers);
router.get('/users/:id', validateObjectId(), c.getUser);
router.put('/users/:id/role', validateObjectId(), c.updateRole);
router.delete('/users/:id', validateObjectId(), c.deleteUser);

router.get('/assessments', c.listAssessments);
router.get('/assessments/:id', validateObjectId(), c.getAssessment);
router.delete('/assessments/:id', validateObjectId(), c.deleteAssessment);

module.exports = router;
