const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

module.exports = {
  ADMIN_USERNAME,
  ADMIN_PASSWORD,
  JWT_SECRET
};
