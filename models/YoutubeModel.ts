import { Schema, model } from 'mongoose';

interface YoutubeInterface {
    index: number;
    title: string;
    url: string;
}

const YoutubeSchema = new Schema<YoutubeInterface>({
    index: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
});

const YoutubeModel = model<YoutubeInterface>('youtube-lessons', YoutubeSchema);

export default YoutubeModel;