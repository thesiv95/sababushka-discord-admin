import { Request, Response, NextFunction } from 'express';
import YoutubeModel from '../models/YoutubeModel';
import { errorHandler, MyResponseType, successHandler } from '../response';
import logger from '../utils/logger';
import dataArray from '../json/youtube-lessons.json';
import SortEnum from '../enums/sort.enum';

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

export const getAllItems = async (req: Request, res: Response, next: NextFunction) => {
    try {
       // This route is for admin panel only
       const page = +req.query.page! || 1;
       const itemsPerPage = 10;
       const skip = page > 1 ? itemsPerPage * (page - 1) : 0;
       const sort = +req.query.sort! || SortEnum.desc;
       const sortOption = sort === SortEnum.asc ? SortEnum.asc : SortEnum.desc;
       
       logger.info(`yt lessons page ${page} - sort ${sortOption}`);

       const foundInfo = await YoutubeModel.find({}).sort({ index: sortOption }).skip(skip).limit(itemsPerPage);

       return next(successHandler(res, foundInfo, MyResponseType.ok));
    } catch (error) {
        const errorCasted = error as Error;
        return next(errorHandler(res, errorCasted));
    }
}

export const search = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const title = req.query.title as string;

        if (!title) {
            logger.info(`Request for latest lesson`);
            const lastLessonInfo = await YoutubeModel.find().sort({ index: -1 }).limit(1);
            return next(successHandler(res, lastLessonInfo[0], MyResponseType.ok));
        }

        // true = from admin panel, false = from bot (=> how many records to limit)
        const admin = req.query.admin as string;
        const isAdmin: boolean = Boolean(admin) || false;

        let searchQuery;

        // if it is a number
        const isNumber = parseInt(title).toString().length === title.length;

        if (isNumber) {
            logger.info(`lesson: number, ${title} - ${isAdmin ? 'admin' : 'bot'}`);
            searchQuery = { index: title, };
        } else {
            logger.info(`lesson: word, ${title} - ${isAdmin ? 'admin' : 'bot'}`);
            searchQuery = { title: { $regex: title, $options: 'i' } };
        }

        let limit;

        if (title && !isAdmin) { // it is from bot with query
            limit = 3; // should be only first 3 items found in bot msg
        } else if (title && isAdmin) { // it is from admin panel
            limit = 10;
        } else if (!title && !isAdmin) { // it is from bot without query
            limit = 0;
        } else { // any other case (as a rule it will not go here but just in case)
            limit = 0;
        }

        const foundInfo = await YoutubeModel.find(searchQuery).limit(limit);
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