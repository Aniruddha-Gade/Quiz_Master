import { IUser } from '../../models/user.model';
import { Request } from 'express';
import { express } from 'express';
import { JwtPayload } from 'jsonwebtoken';


declare global {
  namespace express {
    interface Request {
      user?: IUser; 
      // user?: JwtPayload | string; 
    }
  }
}
