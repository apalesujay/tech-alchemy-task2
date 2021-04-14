import { Router } from 'express';

import { signup, login, logout, refreshSession } from '../controllers/auth';
import auth from '../middlewares/auth';

const router = Router();

router.post('/signup', signup());
router.post('/login', login());
router.get('/logout', auth(), logout());
router.get('/refresh', auth(true), refreshSession());

export default router;
