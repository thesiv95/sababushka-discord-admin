import { Request, Response, NextFunction } from 'express';
import WarWordsModel from '../models/WarWordsModel';
import { errorHandler, MyResponseType, successHandler } from '../response';
import logger from '../utils/logger';
import dataArray from '../json/warwords.json';
import SortEnum from '../enums/sort.enum';

export const addNew = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { ru, translit, he } = req.body;

        logger.info(`Trying to create new war word: ${ru} / ${translit} / ${he}`);

        const newRecord = new WarWordsModel({
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

        // true = from admin panel, false = from bot (=> how many records to limit)
        const admin = req.query.admin as string;
        const isAdmin: boolean = Boolean(admin) || false;

        logger.info(`Search war word by query: ${q ? q : '(no query)'} - ${isAdmin ? 'admin panel' : 'bot'}`);

        let limit;

        if (q && !isAdmin) { // it is from bot with query
            limit = 3; // should be only first 3 items found in bot msg
        } else if (q && isAdmin) { // it is from admin panel
            limit = 10;
        } else if (!q && !isAdmin) { // it is from bot without query
            limit = 0;
        } else { // any other case (as a rule it will not go here but just in case)
            limit = 0;
        }

        const filter = {
            $or: [
                { ru: { $regex: q, $options: 'i' } },
                { he: { $regex: q, $options: 'i' } },
                { translit: { $regex: q, $options: 'i' } },
            ]
        };

        const pipeline = q ? filter : {};
        const foundInfo = await WarWordsModel.find(pipeline).limit(limit);

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
       // show last items by default
       const sort = +req.query.sort! || SortEnum.desc;
       const sortOption = sort === SortEnum.asc ? SortEnum.asc : SortEnum.desc;
       
       logger.info(`war words page ${page} - sort ${sortOption}`);

       const foundInfo = await WarWordsModel.find({}).sort({ _id: sortOption }).skip(skip).limit(itemsPerPage);

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

        logger.info(`Trying to modify war word ${id} => ${ru ? ru : '(no changes)'} / ${translit ? translit : '(no changes)'} / ${he ? he : '(no changes)'}`);

        const modifiedRecord = await WarWordsModel.findByIdAndUpdate(id, {
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

        logger.info(`Trying to delete war word ${id}`);

        const deletedRecord = await WarWordsModel.findByIdAndDelete(id);

        return next(successHandler(res, deletedRecord, MyResponseType.ok));


    } catch (error) {
        const errorCasted = error as Error;
        return next(errorHandler(res, errorCasted));
    }
};

export const restore = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        logger.info('restoring war words');

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
        
        await WarWordsModel.bulkWrite(pipeline);

        return next(successHandler(res, { restored: true }, MyResponseType.ok));
    } catch (error) {
        const errorCasted = error as Error;
        return next(errorHandler(res, errorCasted));
    }
}