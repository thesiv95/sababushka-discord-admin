import { Request, Response, NextFunction } from 'express';
import WordsModel from '../models/WordsModel';
import { errorHandler, MyResponseType, successHandler } from '../response';
import logger from '../utils/logger';
import dataArray from '../json/words.json';

export const addNew = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { ru, translit, he } = req.body;

        logger.info(`Trying to create new word: ${ru} / ${translit} / ${he}`);

        const newRecord = new WordsModel({
            ru,
            translit,
            he,
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
        const q = req.query.q as string;

        logger.info(`Search word by query: ${q ? q : '(no query)'}`);

        // If there are several options, limit response to 3 records (not to make discord message too big)
        const limit = q ? 3 : 0;

        const filter = {
            $or: [
                { ru: { $regex: q, $options: 'i' } },
                { he: { $regex: q, $options: 'i' } },
                { translit: { $regex: q, $options: 'i' } },
            ]
        };

        const pipeline = q ? filter : {};
        const foundInfo = await WordsModel.find(pipeline).limit(limit);

        return next(successHandler(res, foundInfo, MyResponseType.ok));

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
       
       logger.info(`words page ${page}`);

       const foundInfo = await WordsModel.find({}).skip(skip).limit(itemsPerPage);

       return next(successHandler(res, foundInfo, MyResponseType.ok));
    } catch (error) {
        const errorCasted = error as Error;
        return next(errorHandler(res, errorCasted));
    }
}

export const modify = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { ru, translit, he } = req.body;

        logger.info(`Trying to modify word ${id} => ${ru ? ru : '(no changes)'} / ${translit ? translit : '(no changes)'} / ${he ? he : '(no changes)'}`);

        const modifiedRecord = await WordsModel.findByIdAndUpdate(id, {
            ru,
            translit,
            he
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

        logger.info(`Trying to delete word ${id}`);

        const deletedRecord = await WordsModel.findByIdAndDelete(id);

        return next(successHandler(res, deletedRecord, MyResponseType.ok));


    } catch (error) {
        const errorCasted = error as Error;
        return next(errorHandler(res, errorCasted));
    }
};

export const restore = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        logger.info('restoring words');

        const insertDataMapped = dataArray.map((el) => {
            return {
                insertOne: {
                    document: {
                        he: el.he,
                        translit: el.translit,
                        ru: el.ru
                    }
                } 
            }
        });

        const pipeline: any[] = [
            { deleteMany: { filter: {} } },
            ...insertDataMapped,
        ];
        
        await WordsModel.bulkWrite(pipeline);

        return next(successHandler(res, { restored: true }, MyResponseType.ok));
    } catch (error) {
        const errorCasted = error as Error;
        return next(errorHandler(res, errorCasted));
    }
}