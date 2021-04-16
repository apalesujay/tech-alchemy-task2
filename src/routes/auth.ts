import { Router } from 'express';

import { signup, login, logout, refreshSession } from '../controllers/auth';
import auth from '../middlewares/auth';

const router = Router();

// Route for new user registration
router.post('/signup', signup());

// Route for user login
router.post('/login', login());

// Route for logout
router.get('/logout', auth(true), logout());

// Route for  refreshing the user session
router.get('/refresh', auth(true), refreshSession());

export default router;
