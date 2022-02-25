import { Request, Response, NextFunction } from 'express';
import WordsModel from '../models/WordsModel';
import { errorHandler, MyResponseType, successHandler } from '../response';
import logger from '../utils/logger';

export const addNew = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { ru, translit, he } = req.body;

        logger.info(`Trying to create new word: ${ru} / ${translit} / ${he}`);

        const newRecord = new WordsModel({
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
        const { q } = req.query;

        logger.info(`Search word by query: ${q}`);

        const regexOptions = new RegExp(`^[${q}0-9._-]+$`, "ig");

        const findOptions = q ? {
            $or: [
                { ru: regexOptions },
                { tSlug: regexOptions },
                { he: regexOptions },
            ]
        } : {};

        const foundInfo = await WordsModel.find(findOptions);

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