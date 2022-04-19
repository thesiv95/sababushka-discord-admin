import { Schema, model } from 'mongoose';
import BaseObjectInterface from './BaseSchema';

const BituyimSchema = new Schema<BaseObjectInterface>({
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

const BituyimModel = model<BaseObjectInterface>('bituyim', BituyimSchema);

export default BituyimModel;