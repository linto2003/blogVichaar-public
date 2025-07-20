const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

// JWT VERIFY 

const jwtAuth = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1] ;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        req.user = decoded;
        next();
    });}

// JWT GENERATE TOKEN 

const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '15m' });
};

const generateRefreshToken = (user) => {
  return jwt.sign(user, process.env.JWT_REFRESH_SECRET, { expiresIn: '7hr' });
};

module.exports = {
    jwtAuth,generateAccessToken,generateRefreshToken
};
