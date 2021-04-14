import { NextFunction, Request, Response } from 'express';
import { DateTime } from 'luxon';

import axios from '../utils/axios';
import { successResponse, SuccessStatusCode } from '../utils/response';

const getWeatherForecast = () => async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response | void> => {
	try {
		const apiKey = process.env.WEATHER_API_KEY ?? '';
		const latitude = '18.524766';
		const longitude = '73.792927';
		const location = 'Pune';
		const unit = 'metric';
		const lang = 'en';
		const exclude = 'current,minutely,hourly,alerts';
		const count = 5;
		const queryString = `?appid=${apiKey}&lat=${latitude}&lon=${longitude}&units=${unit}&lang=${lang}&exclude=${exclude}&cnt=${count}`;

		const axiosWeather = axios('weather');

		const response = await axiosWeather.get(`/onecall${queryString}`);

		const data = (response.data.daily as Array<any>)
			.filter((item, index) => index < 5)
			.map((item) => ({
				date: DateTime.fromMillis(item.dt * 1000).toFormat(
					'ccc LLLL dd yyyy'
				),
				main: item.weather[0].main,
				description: item.weather[0].description,
				temp: item.temp.max
			}));

		const weather = {
			count,
			unit,
			location,
			latitude,
			longitude,
			data
		};

		return successResponse(
			SuccessStatusCode['200_OK'],
			`Weather forecast from ${weather.data[0].date} to ${weather.data[4].date}`,
			weather,
			res
		);
	} catch (error) {
		return next(error);
	}
};

export default getWeatherForecast;
