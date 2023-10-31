import { Schema, model } from 'mongoose';
import BaseObjectInterface from './BaseSchema';

const WarWordsSchema = new Schema<BaseObjectInterface>({
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

const WarWordsModel = model<BaseObjectInterface>('warwords', WarWordsSchema);

export default WarWordsModel;