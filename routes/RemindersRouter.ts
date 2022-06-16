import { RemindersController } from '../controllers';
import { Router } from 'express';

const remindersRouter = Router();

remindersRouter.get('/off', RemindersController.disableReminder);
remindersRouter.get('/on', RemindersController.enableReminder);
remindersRouter.get('/activeUsers', RemindersController.getActiveUsers);
remindersRouter.get('/getItemsByNickname', RemindersController.getItemsByNickname);
remindersRouter.get('/getAllItems', RemindersController.getAllItems);
remindersRouter.post('/addUser', RemindersController.addUser);
remindersRouter.delete('/remove/:userId', RemindersController.remove);
remindersRouter.get('/restore', RemindersController.restore);

export default remindersRouter;