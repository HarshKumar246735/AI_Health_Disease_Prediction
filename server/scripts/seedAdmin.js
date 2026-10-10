// Creates (or promotes) the admin account from ADMIN_EMAIL / ADMIN_PASSWORD. Run: npm run seed:admin
const connectDB = require('../config/db');
const User = require('../models/User');
const { validateEmail, validatePassword } = require('../utils/validators');

(async () => {
  const { ADMIN_NAME = 'Admin', ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD in server/.env first.');
  if (validateEmail(ADMIN_EMAIL) || validatePassword(ADMIN_PASSWORD)) throw new Error('ADMIN_EMAIL or ADMIN_PASSWORD is not valid (password: 8+ chars, letter and number).');
  await connectDB();
  const email = ADMIN_EMAIL.toLowerCase();
  const existing = await User.findOne({ email });
  if (existing) {
    existing.role = 'ADMIN';
    await existing.save();
    console.log(`Existing user ${email} promoted to ADMIN.`);
  } else {
    await User.create({ name: ADMIN_NAME, email, password: ADMIN_PASSWORD, role: 'ADMIN' });
    console.log(`Admin ${email} created.`);
  }
  process.exit(0);
})().catch((err) => { console.error(err.message); process.exit(1); });
