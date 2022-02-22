import { RemindersController } from '../controllers';
import { Router } from 'express';

const remindersRouter = Router();

remindersRouter.put('/off', RemindersController.disableReminder);
remindersRouter.put('/on', RemindersController.enableReminder);
remindersRouter.get('/activeUsers', RemindersController.getActiveUsers);

export default remindersRouter;