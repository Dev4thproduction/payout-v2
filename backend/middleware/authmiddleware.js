import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../Models/User.js';

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

       const decoded = jwt.verify(token, process.env.JWT_SECRETT);


      const user = await User.findById(decoded.id).select('-password');
     

      if (!user) {
        res.status(401);
        throw new Error('User not found');
      }

      // Check if token version matches (for force logout)
      if (decoded.tokenVersion !== (user.tokenVersion || 0)) {
        res.status(401);
        throw new Error('Token has been invalidated - Please login again');
      }

      // Check if token is blacklisted
      const isTokenBlacklisted = user.blacklistedTokens && user.blacklistedTokens.some(
        blacklistedToken => blacklistedToken.token === token
      );

      if (isTokenBlacklisted) {
        res.status(401);
        throw new Error('Token has been blacklisted - Please login again');
      }

      req.user = user;
      req.token = token;

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role.name)) {
      res.status(403);
      throw new Error('Not authorized to access this route');
    }
    next();
  };
};

export { protect, authorize };