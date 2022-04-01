import { RemindersController } from '../controllers';
import { Router } from 'express';

const remindersRouter = Router();

remindersRouter.get('/off', RemindersController.disableReminder);
remindersRouter.get('/on', RemindersController.enableReminder);
remindersRouter.get('/activeUsers', RemindersController.getActiveUsers);

export default remindersRouter;