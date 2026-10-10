require('dotenv').config();

const required = ['MONGODB_URI', 'JWT_SECRET', 'CLIENT_URL', 'ML_SERVICE_URL'];
const missing = required.filter((key) => !process.env[key]);
if (missing.length) {
  console.error(`Missing required environment variables: ${missing.join(', ')}`);
  process.exit(1);
}
if (process.env.JWT_SECRET.length < 24) {
  console.error('JWT_SECRET is too short. Use at least 24 random characters.');
  process.exit(1);
}

module.exports = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  clientOrigins: process.env.CLIENT_URL.split(',').map((s) => s.trim().replace(/\/$/, '')),
  mlServiceUrl: process.env.ML_SERVICE_URL.replace(/\/$/, ''),
  mlApiKey: process.env.ML_API_KEY || '',
  isProduction: process.env.NODE_ENV === 'production',
};
