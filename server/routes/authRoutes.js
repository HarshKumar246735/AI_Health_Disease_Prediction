const router = require('express').Router();
const rateLimit = require('express-rate-limit');
const c = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many attempts. Please wait a few minutes and try again.' },
});

router.post('/register', authLimiter, c.register);
router.post('/login', authLimiter, c.login);
router.get('/me', protect, c.me);
router.put('/profile', protect, c.updateProfile);
router.put('/change-password', protect, authLimiter, c.changePassword);

module.exports = router;
