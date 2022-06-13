import { YoutubeController } from '../controllers';
import { Router } from 'express';

const youtubeRouter = Router();

youtubeRouter.post('/addNew', YoutubeController.addNew);
youtubeRouter.get('/search', YoutubeController.search);
youtubeRouter.get('/restore', YoutubeController.restore);
youtubeRouter.put('/modify/:id', YoutubeController.modify);
youtubeRouter.delete('/remove/:id', YoutubeController.remove);

export default youtubeRouter;