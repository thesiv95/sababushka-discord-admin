import { Request, Response, NextFunction } from 'express';
import YoutubeModel from '../models/YoutubeModel';
import { errorHandler, MyResponseType, successHandler } from '../response';
import logger from '../utils/logger';

export const addNew = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { index, title, url } = req.body;

        logger.info(`Trying to create new youtube lesson: ${index} / ${title} / ${url}`);

        const newRecord = new YoutubeModel({
            index,
            title,
            url,
        });

        await newRecord.save();

        return next(successHandler(res, newRecord, MyResponseType.created));
    } catch (error) {
        const errorCasted = error as Error;
        return next(errorHandler(res, errorCasted));
    }
};

export const search = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const index = +req.query.index!;
        const title = req.query.title as string;

        if (!index && !title) {
            logger.info(`Request for latest lesson`);
            const lastLessonInfo = await YoutubeModel.find().sort({ index: -1 }).limit(1);
            return next(successHandler(res, lastLessonInfo[0], MyResponseType.ok));
        }

        let searchQuery = {};

        if (title && !index) {
            searchQuery = { title: { $regex: title, $options: 'i' } };
            logger.info(`Search youtube lesson: title ${title}`);
        }

        if (!title && index) { 
            searchQuery = { index };
            logger.info(`Search youtube lesson: index ${index}`);
        };

        if (index && title) {
            logger.info('Search youtube lesson: both params used for request');
            throw new Error('Please select something one!');
        }

        const foundInfo = await YoutubeModel.find(searchQuery);
        return next(successHandler(res, foundInfo, MyResponseType.ok));

    } catch (error) {
        const errorCasted = error as Error;
        return next(errorHandler(res, errorCasted));
    }
};

export const modify = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { index, title, url } = req.body;

        logger.info(`Trying to modify youtube lesson ${id} => ${index ? index : '(no changes)'} / ${title ? title : '(no changes)'} / ${url ? url : '(no changes)'}`);

        const modifiedRecord = await YoutubeModel.findByIdAndUpdate(id, {
            index, title, url
        }, { new: true });

        return next(successHandler(res, modifiedRecord, MyResponseType.modified));

    } catch (error) {
        const errorCasted = error as Error;
        return next(errorHandler(res, errorCasted));
    }
};

// delete is a reserved word, so 'remove' should be used instead
export const remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        logger.info(`Trying to delete youtube lesson ${id}`);

        const deletedRecord = await YoutubeModel.findByIdAndDelete(id);

        return next(successHandler(res, deletedRecord, MyResponseType.ok));


    } catch (error) {
        const errorCasted = error as Error;
        return next(errorHandler(res, errorCasted));
    }
};