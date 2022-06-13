import { TshokimController } from '../controllers';
import { Router } from 'express';

const tshokimRouter = Router();

tshokimRouter.post('/addNew', TshokimController.addNew);
tshokimRouter.get('/search', TshokimController.search);
tshokimRouter.get('/restore', TshokimController.restore);
tshokimRouter.put('/modify/:id', TshokimController.modify);
tshokimRouter.delete('/remove/:id', TshokimController.remove);

export default tshokimRouter;