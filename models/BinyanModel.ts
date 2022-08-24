import { Schema, model } from 'mongoose';

interface BinyanInterface {
    translit: string,
    ru: string,
    // extra options
    infinitive: string | null,
    binyanType: string | null,
    root: string | null,
    timePresent: { // slash
        maleSingle: string | null,
        femaleSingle: string | null,
        malePlural: string | null,
        femalePlural: string | null,
    },
    timePast: {
        me: string | null, // אני
        youMaleSingle: string | null, // אתה
        youFemaleSingle: string | null, // את
        he: string | null, // הוא
        she: string | null, // היא
        we: string | null, // אנחנו
        youMalePlural: string | null, // אתם
        youFemalePlural: string | null, // אתן
        theyMalePlural: string | null, // הם
        theyFemalePlural: string | null, // הן
    }
}

const BinyanSchema = new Schema<BinyanInterface>({
    translit: {
        type: String,
        required: true
    },
    ru: {
        type: String,
        required: true
    },
    // extra options
    infinitive: {
        type: String,
        required: false
    },
    binyanType: {
        type: String,
        required: false
    },
    root: {
        type: String,
        required: false
    },
    timePresent: { // slash
        maleSingle: {
            type: String,
            required: false
        },
        femaleSingle: {
            type: String,
            required: false
        },
        malePlural: {
            type: String,
            required: false
        },
        femalePlural: {
            type: String,
            required: false
        },
    },
    timePast: {
        me: {
            type: String,
            required: false
        }, // אני
        youMaleSingle: {
            type: String,
            required: false
        }, // אתה
        youFemaleSingle: {
            type: String,
            required: false
        }, // את
        he: {
            type: String,
            required: false
        }, // הוא
        she: {
            type: String,
            required: false
        }, // היא
        we: {
            type: String,
            required: false
        }, // אנחנו
        youMalePlural: {
            type: String,
            required: false
        }, // אתם
        youFemalePlural: {
            type: String,
            required: false
        }, // אתן
        theyMalePlural: {
            type: String,
            required: false
        }, // הם
        theyFemalePlural: {
            type: String,
            required: false
        }, // הן
    }
});

const BinyanModel = model<BinyanInterface>('binyan', BinyanSchema);

export default BinyanModel;