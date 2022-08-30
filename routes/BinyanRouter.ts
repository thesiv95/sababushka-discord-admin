import { BinyanController } from '../controllers';
import { Router } from 'express';

const binyanRouter = Router();

binyanRouter.post('/addNew', BinyanController.addNew);
binyanRouter.get('/search', BinyanController.search);
binyanRouter.get('/getAllItems', BinyanController.getAllItems);
binyanRouter.get('/restore', BinyanController.restore);
binyanRouter.put('/modify/:id', BinyanController.modify);
binyanRouter.delete('/remove/:id', BinyanController.remove);

export default binyanRouter;