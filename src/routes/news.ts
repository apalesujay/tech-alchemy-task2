import { Router } from 'express';

import getNews from '../controllers/news';
import auth from '../middlewares/auth';

const router = Router();

router.get('/news', auth(), getNews());

export default router;
