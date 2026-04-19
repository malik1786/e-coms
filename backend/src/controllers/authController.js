const jwt = require('jsonwebtoken');
const {
  ADMIN_USERNAME,
  ADMIN_PASSWORD,
  JWT_SECRET
} = require('../config/admin');

const loginAdmin = (req, res) => {
  const { username, password } = req.body;

  if (
    username !== ADMIN_USERNAME ||
    password !== ADMIN_PASSWORD
  ) {
    return res.status(401).json({ message: 'Invalid admin credentials' });
  }

  const token = jwt.sign(
    { username: ADMIN_USERNAME },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return res.json({
    token,
    admin: {
      username: ADMIN_USERNAME
    }
  });
};

module.exports = {
  loginAdmin
};
