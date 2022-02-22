import { WordsController } from '../controllers';
import { Router } from 'express';

const wordsRouter = Router();

wordsRouter.post('/addNew', WordsController.addNew);
wordsRouter.get('/search', WordsController.search);
wordsRouter.put('/modify/:id', WordsController.modify);
wordsRouter.delete('/remove/:id', WordsController.remove);

export default wordsRouter;