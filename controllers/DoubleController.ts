import { Request, Response, NextFunction } from 'express';
import DoubleModel from '../models/DoubleModel';
import { errorHandler, MyResponseType, successHandler } from '../response';
import logger from '../utils/logger';
import dataArray from '../json/doubles.json';
import SortEnum from '../enums/sort.enum';


export const addNew = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { ru, single, double } = req.body;

        logger.info(`Trying to create new double-word: ${ru} / ${single} / ${double}`);

        const newRecord = new DoubleModel({
            ru,
            single,
            double,
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
       // show last items by default
       const sort = +req.query.sort! || SortEnum.desc;
       const sortOption = sort === SortEnum.asc ? SortEnum.asc : SortEnum.desc;
       
       logger.info(`double-word page ${page} - sort ${sortOption}`);

       const foundInfo = await DoubleModel.find({}).sort({ _id: sortOption }).skip(skip).limit(itemsPerPage);

       return next(successHandler(res, foundInfo, MyResponseType.ok));
    } catch (error) {
        const errorCasted = error as Error;
        return next(errorHandler(res, errorCasted));
    }
}

export const search = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const q = req.query.q as string;

        const admin = req.query.admin as string;
        const isAdmin: boolean = Boolean(admin) || false;
        logger.info(`Search double-word by query: ${q ? q : '(no query)'} - ${isAdmin ? 'admin' : 'bot'}`);
        
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
                { single: { $regex: q, $options: 'i' } },
                { double: { $regex: q, $options: 'i' } },
            ]
        };

        const pipeline = q ? filter : {};
        const foundInfo = await DoubleModel.find(pipeline).limit(limit);

        return next(successHandler(res, foundInfo, MyResponseType.ok));

    } catch (error) {
        const errorCasted = error as Error;
        return next(errorHandler(res, errorCasted));
    }
};

export const modify = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { ru, single, double } = req.body;

        logger.info(`Trying to modify double-word ${id} => ${ru} / ${single} / ${double}`);

        const modifiedRecord = await DoubleModel.findByIdAndUpdate(id, {
            ru, 
            single, 
            double
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

        logger.info(`Trying to delete double-word ${id}`);

        const deletedRecord = await DoubleModel.findByIdAndDelete(id);

        return next(successHandler(res, deletedRecord, MyResponseType.ok));


    } catch (error) {
        const errorCasted = error as Error;
        return next(errorHandler(res, errorCasted));
    }
};

export const restore = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        logger.info('restoring double-words');

        const insertDataMapped = dataArray.map((el) => {
            return {
                insertOne: {
                    document: {
                        ru: el.ru,
                        single: el.single,
                        double: el.double
                    }
                } 
            }
        });

        const pipeline: any[] = [
            { deleteMany: { filter: {} } },
            ...insertDataMapped,
        ];
        
        await DoubleModel.bulkWrite(pipeline);

        return next(successHandler(res, { restored: true }, MyResponseType.ok));
    } catch (error) {
        const errorCasted = error as Error;
        return next(errorHandler(res, errorCasted));
    }
}