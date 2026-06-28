// middleware/logger.js
import type {Request,Response ,NextFunction} from 'express';

function logger(req : Request, res:Response, next:NextFunction) {
    console.log(`${req.method} ${req.url}`);
    next();
}


export default logger;

