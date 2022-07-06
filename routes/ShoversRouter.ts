import { ShoversController } from '../controllers';
import { Router } from 'express';

const shoversRouter = Router();

shoversRouter.post('/addNew', ShoversController.addNew);
shoversRouter.get('/search', ShoversController.search);
shoversRouter.get('/getAllItems', ShoversController.getAllItems);
shoversRouter.get('/restore', ShoversController.restore);
shoversRouter.put('/modify/:id', ShoversController.modify);
shoversRouter.delete('/remove/:id', ShoversController.remove);

export default shoversRouter;