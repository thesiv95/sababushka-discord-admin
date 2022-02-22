import express from 'express';
import auth from './utils/auth';
import dbConnection from './models/dbConnection';
import * as routes from './routes';
import logger from './utils/logger';

// DB async connection
dbConnection().catch(err => logger.info(err));

// Init
const app = express();
app.use(express.json());
app.use(auth);

const PORT = process.env.PORT || 9000;
app.listen(9000, async () => {
    logger.info(`App started on port ${PORT}`)
});

// Routes
app.use('/bituyim', routes.bituyimRouter);
app.use('/nsfws', routes.nsfwsRouter);
app.use('/tshokim', routes.tshokimRouter);
app.use('/words', routes.wordsRouter);
app.use('/reminders', routes.remindersRouter);

// Swagger
