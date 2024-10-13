// declare namespace Express {
//     export interface Request {
//       user: any
//     }
//   }



import * as express from 'express';
// import { IUser } from './models/user.model';

declare global {
  namespace Express {
    interface Request {
      user?: any; 
    }
  }
}
