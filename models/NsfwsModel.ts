import { Schema, model } from 'mongoose';
import BaseObjectInterface from './BaseSchema';

const NsfwsSchema = new Schema<BaseObjectInterface>({
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

const NsfwsModel = model<BaseObjectInterface>('nsfws', NsfwsSchema);

export default NsfwsModel;