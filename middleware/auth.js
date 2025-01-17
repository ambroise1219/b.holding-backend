const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  console.log('Authenticating request...');
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ message: 'Aucun token fourni, autorisation refusée' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log('User authenticated:', req.user);
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      console.log('Token expired');
      return res.status(401).json({ message: 'Token expiré', expired: true });
    }
    console.error('Authentication error:', error);
    res.status(401).json({ message: 'Token invalide, autorisation refusée' });
  }
};

module.exports = auth;