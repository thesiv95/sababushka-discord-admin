import { config } from 'dotenv';
import { Request, Response, NextFunction } from 'express';
import { authErrorHandler, errorHandler } from '../response';
import logger from './logger';
config();

// Auth middleware
const auth = (req: Request, res: Response, next: NextFunction) => {
    try {

        const apiKey = req.headers['x-api-key'] as string;
        const envApiKey = process.env.API_KEY as string;

        if (apiKey !== envApiKey) {
            logger.warn(`Provided key ${apiKey} is incorrect!`);
            return next(authErrorHandler(res));
        }

        return next();

    } catch (error) {
        const errorCasted = error as Error;
        return next(errorHandler(res, errorCasted));
    }

};

export default auth;