import { Router } from 'express';

import getWeatherForecast from '../controllers/weather';

const router = Router();

router.get('/weather', getWeatherForecast());

export default router;
