import { WarWordsController } from '../controllers';
import { Router } from 'express';

const wordsRouter = Router();

wordsRouter.post('/addNew', WarWordsController.addNew);
wordsRouter.get('/search', WarWordsController.search);
wordsRouter.get('/getAllItems', WarWordsController.getAllItems);
wordsRouter.get('/restore', WarWordsController.restore);
wordsRouter.put('/modify/:id', WarWordsController.modify);
wordsRouter.delete('/remove/:id', WarWordsController.remove);

export default wordsRouter;