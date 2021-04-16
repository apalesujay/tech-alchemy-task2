import { Router } from 'express';

import getNews from '../controllers/news';
import auth from '../middlewares/auth';

const router = Router();

// Route to fetch news
// This is a protected route
router.get('/news', auth(), getNews());

export default router;
