import { Request, Response, NextFunction } from 'express';
import { SessionService } from '../services/session.service';

const sessionService = new SessionService();

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.cookies?.session;

    if (!id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const session = await sessionService.get(id);
    console.log(session);
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    req.session = session;
    req.user = session.user;

    next();
  } catch (error) {
    next(error);
  }
};
