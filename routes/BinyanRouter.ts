import { BinyanController } from '../controllers';
import { Router } from 'express';

const binyanRouter = Router();

binyanRouter.post('/addNew', BinyanController.addNew);
binyanRouter.get('/search', BinyanController.search);
binyanRouter.get('/getAllItems', BinyanController.getAllItems);
binyanRouter.get('/restore', BinyanController.restore);
bituyimRouter.put('/modify/:id', BinyanController.modify);
bituyimRouter.delete('/remove/:id', BinyanController.remove);

export default binyanRouter;