import { Schema, model } from 'mongoose';
import BaseObjectInterface from './BaseSchema';

const TshokimSchema = new Schema<BaseObjectInterface>({
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

const TshokimModel = model<BaseObjectInterface>('tshokim', TshokimSchema);

export default TshokimModel;