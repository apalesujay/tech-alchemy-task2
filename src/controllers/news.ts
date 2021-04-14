import { NextFunction, Request, Response } from 'express';

import axios from '../utils/axios';
import AppError from '../utils/error';
import {
	ErrorStatusCode,
	successResponse,
	SuccessStatusCode
} from '../utils/response';

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

		if (!q) {
			throw new AppError(
				ErrorStatusCode['400_BAD_REQUEST'],
				'Please enter a search query'
			);
		}

		if (page === undefined) {
			page = '1';
		}

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

		if (typeof page === 'string' && page < '1') {
			throw new AppError(
				ErrorStatusCode['400_BAD_REQUEST'],
				'Page number starts from 1'
			);
		}

		const from = Number(page) * pageSize - pageSize + 1;
		const to = Number(page) * pageSize;

		if (typeof page === 'string' && page > '5') {
			throw new AppError(
				ErrorStatusCode['403_FORBIDDEN'],
				`You have requested too many results. Free accounts are limited to a max of 100 results. You are trying to request results from ${from} to ${to}.`
			);
		}

		const queryString = `?q=${q}&language=${language}&apiKey=${apiKey}&pageSize=${pageSize}&page=${page}`;

		const axiosNews = axios('news');

		const response = await axiosNews.get(`/everything${queryString}`);

		const data = (response.data.articles as Array<any>).map((item) => ({
			publisher: item.source.name,
			headline: item.title,
			description: item.description,
			link: item.url,
			image: item.urlToImage,
			publishedAt: item.publishedAt
		}));

		let { totalResults } = response.data;

		totalResults = totalResults > 100 ? 100 : totalResults;

		const news = {
			count: totalResults,
			page: Number(page),
			searchQuery: q,
			data
		};

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
