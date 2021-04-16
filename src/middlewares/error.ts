import { NextFunction, Request, Response } from 'express';

import AppError from '../utils/error';
import log from '../utils/logger';
import { errorResponse } from '../utils/response';

// Miidleware for handling errors
const handleError = (
	err: AppError,
	req: Request,
	res: Response,
	next: NextFunction
): Response => {
	const status: number = err.httpStatusCode || 500;
	const message: string =
		status === 500 ? 'Something went wrong at the server' : err.message;

	// Keep log of the unknow server side errors
	if (status === 500) {
		log.error(`${message}\n${err.stack}`);
	}

	return errorResponse(status, message, res);
};

export default handleError;
