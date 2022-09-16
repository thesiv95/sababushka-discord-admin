import { Request, Response, NextFunction } from 'express';
import SortEnum from '../enums/sort.enum';
import BinyanModel from "../models/BinyanModel";
import { errorHandler, MyResponseType, successHandler } from '../response';
import dataArray from '../json/binyans.json';
import logger from '../utils/logger';

export const addNew = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { 
            ru,
            translit,
            infinitive,
            binyanType,
            root,
            timePresent,
            timePast
         } = req.body;

        logger.info(`Trying to create new binyan: ${ru} / ${translit}`);

        const newRecord = new BinyanModel({
            ru,
            translit,
            infinitive,
            binyanType,
            root,
            timePresent,
            timePast
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

        const admin = req.query.admin as string;
        const isAdmin: boolean = Boolean(admin) || false;
        logger.info(`Search binyan by query: ${q ? q : '(no query)'} - ${isAdmin ? 'admin' : 'bot'}`);
        
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
                { translit: { $regex: q, $options: 'i' } },
                { infinitive: { $regex: q, $options: 'i' } },
            ]
        };

        const pipeline = q ? filter : {};
        const foundInfo = await BinyanModel.find(pipeline).limit(limit);

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
       const itemsPerPage = 4; // yeah, they are too big...
       const skip = page > 1 ? itemsPerPage * (page - 1) : 0;
       // show last items by default
       const sort = +req.query.sort! || SortEnum.desc;
       const sortOption = sort === SortEnum.asc ? SortEnum.asc : SortEnum.desc;
       
       logger.info(`binyan page ${page} - sort ${sortOption}`);

       const foundInfo = await BinyanModel.find({}).sort({ _id: sortOption }).skip(skip).limit(itemsPerPage);

       return next(successHandler(res, foundInfo, MyResponseType.ok));
    } catch (error) {
        const errorCasted = error as Error;
        return next(errorHandler(res, errorCasted));
    }
}

export const modify = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { 
            ru,
            translit,
            infinitive,
            binyanType,
            root,
            timePresent,
            timePast
         } = req.body;

        logger.info(`Trying to modify binyan ${id} => ${ru} / ${translit}`);

        const modifiedRecord = await BinyanModel.findByIdAndUpdate(id, {
            ru,
            translit,
            infinitive,
            binyanType,
            root,
            timePresent,
            timePast
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

        logger.info(`Trying to delete binyan ${id}`);

        const deletedRecord = await BinyanModel.findByIdAndDelete(id);

        return next(successHandler(res, deletedRecord, MyResponseType.ok));


    } catch (error) {
        const errorCasted = error as Error;
        return next(errorHandler(res, errorCasted));
    }
};

export const restore = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        logger.info('restoring binyans');

        const insertDataMapped = dataArray.map((el) => {
            return {
                insertOne: {
                    document: {
                        translit: el.translit,
                        ru: el.ru,
                        infinitive: el.infinitive,
                        binyanType: el.binyanType,
                        root: el.root,
                        timePresent: el.timePresent,
                        timePast: el.timePast
                    }
                } 
            }
        });

        const pipeline: any[] = [
            { deleteMany: { filter: {} } },
            ...insertDataMapped,
        ];
        
        await BinyanModel.bulkWrite(pipeline);

        return next(successHandler(res, { restored: true }, MyResponseType.ok));
    } catch (error) {
        const errorCasted = error as Error;
        return next(errorHandler(res, errorCasted));
    }
}