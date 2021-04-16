import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

// Axios configuration for weather API
const weatherConfig: AxiosRequestConfig = {
	baseURL: 'http://api.openweathermap.org/data/2.5'
};

// Axios configuration for news API
const newsConfig: AxiosRequestConfig = {
	baseURL: 'https://newsapi.org/v2'
};

// Function to create axios instance
const createInstance = (api: 'weather' | 'news'): AxiosInstance => {
	if (api === 'weather') {
		return axios.create(weatherConfig);
	}

	return axios.create(newsConfig);
};

export default createInstance;
