import { BinyanController } from '../controllers';
import { Router } from 'express';

const binyanRouter = Router();

binyanRouter.post('/addNew', BinyanController.addNew);
binyanRouter.get('/getAllItems', BinyanController.getAllItems);
binyanRouter.get('/search', BinyanController.search);
binyanRouter.get('/restore', BinyanController.restore);

export default binyanRouter;