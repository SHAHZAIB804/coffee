import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

/**
 * Simple admin authentication middleware.
 * Checks for a header `x-admin-token` that must match the value of `ADMIN_TOKEN` in .env.
 * If the token matches, `req.isAdmin = true` and the request proceeds.
 * Otherwise a 401 Unauthorized response is sent.
 */
export const isAdmin = (req, res, next) => {
  const token = req.headers['x-admin-token'];
  const adminToken = process.env.ADMIN_TOKEN;
  if (adminToken && token && token === adminToken) {
    req.isAdmin = true;
    return next();
  }
  return res.status(401).json({ message: 'Unauthorized: admin token missing or invalid' });
};
