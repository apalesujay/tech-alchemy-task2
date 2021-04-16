import { NextFunction, Request, Response } from 'express';

import axios from '../utils/axios';
import AppError from '../utils/error';
import {
	ErrorStatusCode,
	successResponse,
	SuccessStatusCode
} from '../utils/response';
import { getData, setData } from '../utils/cache';

// Controller to search news
const getNews = () => async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response | void> => {
	try {
		const apiKey = process.env.NEWS_API_KEY ?? '';
		const language = 'en';
		const pageSize = 20;
		let { page } = req.query;
		const q = req.query.search;
		const queryString = `?q=${q}&language=${language}&apiKey=${apiKey}&pageSize=${pageSize}&page=${page}`;

		// If the search query is undefined or an empty string, throw an error
		if (!q) {
			throw new AppError(
				ErrorStatusCode['400_BAD_REQUEST'],
				'Please enter a search query'
			);
		}

		// If page is undefined, set the value of page to 1
		if (page === undefined) {
			page = '1';
		}

		// IF page number is not an integer, throw an error
		if (
			typeof page === 'string' &&
			!isNaN(Number(page)) &&
			parseInt(page, 10).toString() !== page &&
			!isNaN(parseInt(page, 10))
		) {
			throw new AppError(
				ErrorStatusCode['400_BAD_REQUEST'],
				'Page number should be an integer'
			);
		}

		// If page number is less than 1, throw an error
		if (typeof page === 'string' && page < '1') {
			throw new AppError(
				ErrorStatusCode['400_BAD_REQUEST'],
				'Page number starts from 1'
			);
		}

		const from = Number(page) * pageSize - pageSize + 1;
		const to = Number(page) * pageSize;

		// News API returns max 100 results for developer account
		// If user inserts page number greater than 5, throw an error
		if (typeof page === 'string' && page > '5') {
			throw new AppError(
				ErrorStatusCode['403_FORBIDDEN'],
				`You have requested too many results. Free accounts are limited to a max of 100 results. You are trying to request results from ${from} to ${to}.`
			);
		}

		// Fetch news data from cache
		const dataFromCache = getData(`news:${q}:${page}`);

		// IF data is present in the cache, return data as response
		if (dataFromCache) {
			return successResponse(
				SuccessStatusCode['200_OK'],
				`Showing results from ${from} to ${to}`,
				dataFromCache,
				res
			);
		}

		// Else fetch data from news API
		const axiosNews = axios('news');

		const response = await axiosNews.get(`/everything${queryString}`);

		// Format the data
		const data = (response.data.articles as Array<any>).map((item) => ({
			publisher: item.source.name,
			headline: item.title,
			description: item.description,
			link: item.url,
			image: item.urlToImage,
			publishedAt: item.publishedAt
		}));

		let { totalResults } = response.data;

		// Since News API only returns hundred results for develoepr account, set total results to 100
		totalResults = totalResults > 100 ? 100 : totalResults;

		const news = {
			count: totalResults,
			page: Number(page),
			searchQuery: q,
			data
		};

		// Save data in the cache
		if (data.length !== 0) {
			setData(`news:${q}:${page}`, news);
		}

		return successResponse(
			SuccessStatusCode['200_OK'],
			`Showing results from ${from} to ${to}`,
			news,
			res
		);
	} catch (error) {
		return next(error);
	}
};

export default getNews;
