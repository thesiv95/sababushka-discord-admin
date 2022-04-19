import { Request, Response, NextFunction } from 'express';
import ReminderModel from '../models/ReminderModel';
import { errorHandler, MyResponseType, successHandler } from '../response';
import logger from '../utils/logger';

const userExists = async (userId: string, option: string): Promise<boolean> => {
    try {
        const something = await ReminderModel.exists({ userId });
        logger.info(
            `user ${userId} exists? ${something !== null ? 'yes' : 'no'} => ${option}`
        );
        return something !== null; // if !== null => true
    } catch (error) {
        logger.info(`user exists func: ${error}`);
        return false;
    }
};

export const enableReminder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.query.userId as string;
        const userName = req.query.userName as string;
        const thisUserExists = await userExists(userId, 'on');

        if (thisUserExists) {
            await ReminderModel.findOneAndUpdate({ userId }, { isActive: true });
            return next(successHandler(res, {
                userId,
                userName,
                isNewUser: false,
                active: true
            }, MyResponseType.modified));
        } else {
            await ReminderModel.create({ userId, userName, isActive: true });
            return next(successHandler(res, {
                userId,
                userName,
                isNewUser: true,
                active: true
            }, MyResponseType.created));
        }
    } catch (error) {
        const errorCasted = error as Error;
        return next(errorHandler(res, errorCasted));
    }
};

export const disableReminder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.query.userId as string;
        const userName = req.query.userName as string;
        const thisUserExists = await userExists(userId, 'off');

        if (thisUserExists) {
            await ReminderModel.findOneAndUpdate({ userId }, { isActive: false });
            return next(successHandler(res, {
                userId,
                userName,
                isNewUser: false,
                active: false
            }, MyResponseType.modified));
        } else {
            await ReminderModel.create({ userId, userName, isActive: false });
            return next(successHandler(res, {
                userId,
                userName,
                isNewUser: true,
                active: false
            }, MyResponseType.created));
        }
    } catch (error) {
        const errorCasted = error as Error;
        return next(errorHandler(res, errorCasted));
    }
};

export const getActiveUsers = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await ReminderModel.find({ isActive: true });
        return next(successHandler(res, users, MyResponseType.ok));
    } catch (error) {
        const errorCasted = error as Error;
        return next(errorHandler(res, errorCasted));
    }
}