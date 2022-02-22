import { Schema, model } from 'mongoose';
import BaseObjectInterface from './BaseSchema';

const WordsSchema = new Schema<BaseObjectInterface>({
    he: {
        type: String,
        required: true
    },
    translit: {
        type: String,
        required: true
    },
    ru: {
        type: String,
        required: true
    },
});

const WordsModel = model<BaseObjectInterface>('words', WordsSchema);

export default WordsModel;

