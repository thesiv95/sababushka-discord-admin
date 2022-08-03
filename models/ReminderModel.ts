import { Schema, model } from 'mongoose';

interface ReminderInterface {
    userId: string,
    userName: string,
    isActive: boolean
}

const ReminderSchema = new Schema<ReminderInterface>({
    userId: {
        type: String,
        maxlength: 19
    },
    userName: {
        type: String,
    },
    isActive: {
        type: Boolean,
    },
});

const reminderModel = model<ReminderInterface>('reminders', ReminderSchema);

export default reminderModel;

