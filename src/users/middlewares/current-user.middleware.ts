import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { UsersService } from "../users.service";
import { User } from '../user.entity';

declare global {
    namespace Express {
        interface Request {
            currentUser?: User;
        }
    }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
    constructor(private usersService: UsersService) {}

    async use(req: Request, res: Response, next: NextFunction) {
        const { userId } = req.session || {};

        if(userId) {
            const user = await this.usersService.findOne(userId);
            
            req.currentUser = user;
        }

        next();
    }
}




// req.currentUser = user;
// Property 'currentUser' does not exist on type 'Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>'.ts(2339)
// For that reason we create 
// import { User } from '../user.entity';
// declare global {
//     namespace Express {
//         interface Request {
//             currentUser?: User;
//         }
//     }
// }