import { describe, test, expect } from '@jest/globals';
import createInstance from '../src/utils/axios';

describe('createInstance Function', () => {
	test('Should return axios instance with the configuration for Openweathermap API', () => {
		const axiosWeather = createInstance('weather');

		expect(axiosWeather).toHaveProperty(
			'defaults.baseURL',
			'http://api.openweathermap.org/data/2.5'
		);
	});

	test('Should return axios instance with the configuration for NewsAPI API', () => {
		const axiosWeather = createInstance('news');

		expect(axiosWeather).toHaveProperty(
			'defaults.baseURL',
			'https://newsapi.org/v2'
		);
	});
});
