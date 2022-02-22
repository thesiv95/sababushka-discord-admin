import { BituyimController } from '../controllers';
import { Router } from 'express';

const bituyimRouter = Router();

bituyimRouter.post('/addNew', BituyimController.addNew);
bituyimRouter.get('/search', BituyimController.search);
bituyimRouter.put('/modify/:id', BituyimController.modify);
bituyimRouter.delete('/remove/:id', BituyimController.remove);

export default bituyimRouter;