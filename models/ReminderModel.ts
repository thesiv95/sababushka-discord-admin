import { Schema, model } from 'mongoose';

interface ReminderInterface {
    userId: string,
    active: boolean
}

const ReminderSchema = new Schema<ReminderInterface>({
    userId: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        required: true
    },
});

const reminderModel = model<ReminderInterface>('reminders', ReminderSchema);

export default reminderModel;

