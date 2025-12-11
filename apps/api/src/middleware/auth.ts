import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError, ForbiddenError } from './error-handler.js';
import { prisma } from '../lib/prisma.js';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  companyId?: string;
  isAdmin?: boolean;
}

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, JWT_SECRET) as JWTPayload;
}

export async function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided');
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    // Verify user still exists and is active
    if (decoded.isAdmin) {
      const adminUser = await prisma.adminUser.findUnique({
        where: { id: decoded.userId },
      });
      if (!adminUser || !adminUser.isActive) {
        throw new UnauthorizedError('User not found or inactive');
      }
    } else {
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });
      if (!user || !user.isActive) {
        throw new UnauthorizedError('User not found or inactive');
      }
    }

    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new UnauthorizedError('Invalid token'));
    } else if (error instanceof jwt.TokenExpiredError) {
      next(new UnauthorizedError('Token expired'));
    } else {
      next(error);
    }
  }
}

export function requireRole(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError());
    }

    if (!roles.includes(req.user.role)) {
      return next(new ForbiddenError('Insufficient permissions'));
    }

    next();
  };
}

export function requireAdmin(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  if (!req.user || !req.user.isAdmin) {
    return next(new ForbiddenError('Admin access required'));
  }
  next();
}

export async function requireCompanyAccess(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  if (!req.user) {
    return next(new UnauthorizedError());
  }

  // Admin users have access to all companies
  if (req.user.isAdmin) {
    return next();
  }

  // Company ID from params or body
  const companyId = req.params.companyId || req.body.companyId || req.user.companyId;

  if (!companyId || companyId !== req.user.companyId) {
    return next(new ForbiddenError('Access denied to this company'));
  }

  next();
}
