import { Request, Response, NextFunction } from 'express';

const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  //console.log(req.session, req.session!.user)
  if (
    req.session &&
    req.session.user !== undefined &&
    req.session.user.trim() !== ''
  ) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

export default requireAuth;
