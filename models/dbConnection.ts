import mongoose from 'mongoose';
import { config } from 'dotenv';
import logger from '../utils/logger';

config();
const dbURL = process.env.MONGO_URL as string;

async function dbConnection(): Promise<void> {
    try {
        await mongoose.connect(dbURL);
        logger.info('DB connected.');
    } catch (error) {
        logger.error(JSON.stringify(error));
        process.exit(1);
    }
};

export default dbConnection;