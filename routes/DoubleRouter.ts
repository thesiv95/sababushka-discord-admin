import { DoubleController } from '../controllers';
import { Router } from 'express';

const doubleRouter = Router();

doubleRouter.post('/addNew', DoubleController.addNew);
doubleRouter.get('/search', DoubleController.search);
doubleRouter.get('/getAllItems', DoubleController.getAllItems);
doubleRouter.get('/restore', DoubleController.restore);
doubleRouter.put('/modify/:id', DoubleController.modify);
doubleRouter.delete('/remove/:id', DoubleController.remove);

export default doubleRouter;