import { NsfwsController } from '../controllers';
import { Router } from 'express';

const nsfwsRouter = Router();

nsfwsRouter.post('/addNew', NsfwsController.addNew);
nsfwsRouter.get('/search', NsfwsController.search);
nsfwsRouter.get('/getAllItems', NsfwsController.getAllItems);
nsfwsRouter.get('/restore', NsfwsController.restore);
nsfwsRouter.put('/modify/:id', NsfwsController.modify);
nsfwsRouter.delete('/remove/:id', NsfwsController.remove);

export default nsfwsRouter;