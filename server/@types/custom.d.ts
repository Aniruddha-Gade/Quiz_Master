// declare namespace Express {
//     export interface Request {
//       user: any
//     }
//   }



import * as express from 'express';


declare global {
  namespace Express {
    interface Request {
      user?: any; 
    }
  }
}
