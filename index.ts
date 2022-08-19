import express from 'express';
import cors from 'cors';
import auth from './utils/auth';
import dbConnection from './models/dbConnection';
import * as routes from './routes';
import logger from './utils/logger';

// DB async connection
dbConnection().catch(err => logger.info(err));

// Init
const app = express();
app.use(express.json());
app.use(cors());
app.use(auth);

// Routes
app.use('/bituyim', routes.bituyimRouter);
app.use('/nsfws', routes.nsfwsRouter);
app.use('/tshokim', routes.tshokimRouter);
app.use('/words', routes.wordsRouter);
app.use('/reminders', routes.remindersRouter);
app.use('/youtube', routes.youtubeRouter);
app.use('/shovers', routes.shoversRouter);
app.use('/binyans', routes.binyanRouter);

// Start
const HOST = '0.0.0.0';
const PORT = +process.env.PORT! || 9000;
app.listen(PORT, HOST, async () => {
    logger.info(`App started on port ${PORT}`)
});
