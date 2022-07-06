import { Request, Response, NextFunction } from 'express';
import ReminderModel from '../models/ReminderModel';
import { errorHandler, MyResponseType, successHandler } from '../response';
import logger from '../utils/logger';
import dataArray from '../json/reminders.json';
import SortEnum from '../enums/sort.enum';

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

export const addUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, userName } = req.body;

        logger.info(`Trying to create new user for reminder: ${userId} / ${userName}`);

        const newRecord = new ReminderModel({
            userId,
            userName,
            isActive: true,
        });

        await newRecord.save();

        return next(successHandler(res, newRecord, MyResponseType.created));
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

export const getAllItems = async (req: Request, res: Response, next: NextFunction) => {
    try {
       // This route is for admin panel only
       const page = +req.query.page! || 1;
       const itemsPerPage = 10;
       const skip = page > 1 ? itemsPerPage * (page - 1) : 0;
       // show last items by default
       const sort = +req.query.sort! || SortEnum.desc;
       const sortOption = sort === SortEnum.asc ? SortEnum.asc : SortEnum.desc;
       
       logger.info(`reminders page ${page} - sort ${sortOption}`);

       const foundInfo = await ReminderModel.find({}).sort({ _id: sortOption }).skip(skip).limit(itemsPerPage);

       return next(successHandler(res, foundInfo, MyResponseType.ok));
    } catch (error) {
        const errorCasted = error as Error;
        return next(errorHandler(res, errorCasted));
    }
}

export const getItemsByNickname = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userName = req.query.name as string;
        const foundInfo = await ReminderModel.find({ userName });

        return next(successHandler(res, foundInfo, MyResponseType.ok));
    } catch (error) {
        const errorCasted = error as Error;
        return next(errorHandler(res, errorCasted));
    }
}

export const remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.params;
        
        const deletedRecord = await ReminderModel.findOneAndDelete({ userId });
        return next(successHandler(res, deletedRecord, MyResponseType.ok));
    } catch (error) {
        const errorCasted = error as Error;
        return next(errorHandler(res, errorCasted));
    }
}

export const restore = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        logger.info('restoring reminders');

        const insertDataMapped = dataArray.map((el) => {
            return {
                insertOne: {
                    document: {
                        isActive: el.isActive,
                        userId: el.userId,
                        userName: el.userName,
                    }
                } 
            }
        });

        const pipeline: any[] = [
            { deleteMany: { filter: {} } },
            ...insertDataMapped,
        ];
        
        await ReminderModel.bulkWrite(pipeline);

        return next(successHandler(res, { restored: true }, MyResponseType.ok));
    } catch (error) {
        const errorCasted = error as Error;
        return next(errorHandler(res, errorCasted));
    }
}