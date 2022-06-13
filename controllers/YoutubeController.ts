import { Request, Response, NextFunction } from 'express';
import YoutubeModel from '../models/YoutubeModel';
import { errorHandler, MyResponseType, successHandler } from '../response';
import logger from '../utils/logger';
import dataArray from '../json/youtube-lessons.json';

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
        const title = req.query.title as string;

        if (!title) {
            logger.info(`Request for latest lesson`);
            const lastLessonInfo = await YoutubeModel.find().sort({ index: -1 }).limit(1);
            return next(successHandler(res, lastLessonInfo[0], MyResponseType.ok));
        }

        let searchQuery;

        // if it is a number
        const isNumber = parseInt(title).toString().length === title.length;

        if (isNumber) {
            logger.info('lesson: number ' + title);
            searchQuery = { index: title, };
        } else {
            logger.info('lesson: word ' + title);
            searchQuery = { title: { $regex: title, $options: 'i' } };
        }

        const foundInfo = await YoutubeModel.find(searchQuery).limit(3);
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

export const restore = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        logger.info('restoring youtube lessons');

        const insertDataMapped = dataArray.map((el) => {
            return {
                insertOne: {
                    document: {
                        index: el.index,
                        title: el.title,
                        url: el.url,
                    }
                } 
            }
        });

        const pipeline: any[] = [
            { deleteMany: { filter: {} } },
            ...insertDataMapped,
        ];
        
        await YoutubeModel.bulkWrite(pipeline);

        return next(successHandler(res, { restored: true }, MyResponseType.ok));
    } catch (error) {
        const errorCasted = error as Error;
        return next(errorHandler(res, errorCasted));
    }
}