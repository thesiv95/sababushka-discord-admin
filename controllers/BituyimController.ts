import { Request, Response, NextFunction } from 'express';
import BituyimModel from '../models/BituyimModel';
import { errorHandler, MyResponseType, successHandler } from '../response';
import logger from '../utils/logger';

export const addNew = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { ru, translit, he } = req.body;

        logger.info(`Trying to create new bituy: ${ru} / ${translit} / ${he}`);

        const newRecord = new BituyimModel({
            ru,
            translit,
            he,
            tSlug: translit.toLowerCase(),
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
        const { q } = req.params;

        logger.info(`Search word by query: ${q ? q : '(no query)'}`);
        
        const pipeline = q ? {ru: q} : {};
        const foundInfo = await BituyimModel.find(pipeline);

        return next(successHandler(res, foundInfo, MyResponseType.ok));

    } catch (error) {
        const errorCasted = error as Error;
        return next(errorHandler(res, errorCasted));
    }
};

export const modify = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { ru, translit, he } = req.body;

        logger.info(`Trying to modify bituy ${id} => ${ru} / ${translit} / ${he}`);

        const modifiedRecord = await BituyimModel.findByIdAndUpdate(id, {
            ru,
            translit,
            he
        });

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

        const deletedRecord = await BituyimModel.findByIdAndDelete(id);

        return next(successHandler(res, deletedRecord, MyResponseType.ok));


    } catch (error) {
        const errorCasted = error as Error;
        return next(errorHandler(res, errorCasted));
    }
};