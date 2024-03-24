import { Request, Response, NextFunction } from 'express';

const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (req.session && req.session.user !== undefined) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

export default requireAuth;
