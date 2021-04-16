import { Router } from 'express';

import getWeatherForecast from '../controllers/weather';

const router = Router();

// Route to fetch the weather forecast data
router.get('/weather', getWeatherForecast());

export default router;
