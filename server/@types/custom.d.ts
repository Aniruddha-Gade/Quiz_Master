import * as express from 'express';

export interface IUser {
  _id: string;
  email: string;
  accountType: string;
  username: string;
  regId: string;
}


declare global {
  namespace Express {
    interface Request {
      user?: IUser; 
    }
  }
}
