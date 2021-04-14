import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const weatherConfig: AxiosRequestConfig = {
	baseURL: 'http://api.openweathermap.org/data/2.5'
};

const newsConfig: AxiosRequestConfig = {
	baseURL: 'https://newsapi.org/v2'
};

const createInstance = (api: 'weather' | 'news'): AxiosInstance => {
	if (api === 'weather') {
		return axios.create(weatherConfig);
	}

	return axios.create(newsConfig);
};

export default createInstance;
