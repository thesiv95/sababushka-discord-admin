import { Schema, model } from 'mongoose';

interface DoubleObjectInterface {
    ru: string;
    single: string;
    double: string;
}

const DoubleSchema = new Schema<DoubleObjectInterface>({
    ru: {
        type: String,
        required: true
    },
    single: {
        type: String,
        required: true
    },
    double: {
        type: String,
        required: true
    },
});

const DoubleModel = model<DoubleObjectInterface>('doubles', DoubleSchema);

export default DoubleModel;