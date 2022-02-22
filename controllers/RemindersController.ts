import { Request, Response, NextFunction } from 'express';
import ReminderModel from '../models/ReminderModel';
import { errorHandler, MyResponseType, successHandler } from '../response';
import logger from '../utils/logger';

const userExists = async (userId: string): Promise<boolean> => {
    try {
        const something = await ReminderModel.exists({ userId });
        return something !== null; // if !== null => true
    } catch (error) {
        logger.info(`user exists func: ${error}`);
        return false;
    }
};

export const enableReminder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.params;
        const thisUserExists = await userExists(userId);

        if (thisUserExists) {
            await ReminderModel.findOneAndUpdate({ userId }, { active: true });
            return next(successHandler(res, {
                isNewUser: false,
                active: true
            }, MyResponseType.modified));
        } else {
            await ReminderModel.create({ userId, active: true });
            return next(successHandler(res, {
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
        const { userId } = req.params;
        const thisUserExists = await userExists(userId);

        if (thisUserExists) {
            await ReminderModel.findOneAndUpdate({ userId }, { active: false });
            return next(successHandler(res, {
                isNewUser: false,
                active: false
            }, MyResponseType.modified));
        } else {
            await ReminderModel.create({ userId, active: false });
            return next(successHandler(res, {
                isNewUser: true,
                active: false
            }, MyResponseType.created));
        }
    } catch (error) {
        const errorCasted = error as Error;
        return next(errorHandler(res, errorCasted));
    }
};

export const getActiveUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await ReminderModel.find({ active: true });

        return next(successHandler(res, users, MyResponseType.ok));

    } catch (error) {
        const errorCasted = error as Error;
        return next(errorHandler(res, errorCasted));
    }
}