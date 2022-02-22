import path from 'path';
import { createLogger, format, transports } from 'winston';
const { combine, splat, timestamp, printf } = format;

const logFormat = printf(({ level, message, timestamp }) => {
    // remove T,Z,.ms from timestamp
    return `${timestamp.replace('T', ' ').slice(0, -5)} [${level}] ${message}`;
});

/**
 * Logger instance
 */
const logger = createLogger({
    level: process.env.LOG_LEVEL,
    format: combine(
        splat(),
        timestamp(),
        logFormat
    ),
    transports: [
        new transports.Console(),
        new transports.File({
            filename: path.resolve(__dirname, '..', 'logs', 'app.log')
        }),
    ],
});

export default logger;