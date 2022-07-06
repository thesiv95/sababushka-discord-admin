import { Schema, model } from 'mongoose';
import BaseObjectInterface from './BaseSchema';

const ShoversSchema = new Schema<BaseObjectInterface>({
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

const ShoversModel = model<BaseObjectInterface>('shovers', ShoversSchema);

export default ShoversModel;