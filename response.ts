import { Response } from 'express';
import logger from './utils/logger';

export enum MyResponseType {
    'ok' = 200,
    'created' = 201,
    'modified' = 202
}

export const successHandler = (res: Response, data: any, respType: MyResponseType) => {
    const code = respType;

    return res.status(code).send({
        isError: false,
        data,
        code,
    });
}

export const authErrorHandler = (res: Response) => {
    return res.status(401).send({
        isError: true,
        message: 'Authorization failed',
        name: 'AUTH_ERROR',
        stack: null
    });
}

export const errorHandler = (res: Response, error: Error) => {
    const isDev = process.env.NODE_ENV!.startsWith('dev');

    logger.error(JSON.stringify(error.stack!));

    return res.status(500).send({
        isError: true,
        message: error.message,
        name: error.name,
        stack: isDev ? error.stack! : '(hidden on prod)'
    });
}
