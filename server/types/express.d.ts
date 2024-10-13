import * as express from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string;
        email: string;
        accountType: string;
        username: string;
        regId: string;
      };
    }
  }
}