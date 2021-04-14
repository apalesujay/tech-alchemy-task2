import { Response } from 'express';

export enum SuccessStatusCode {
	'200_OK' = 200,
	'201_CREATED' = 201,
	'204_NO_CONTENT' = 200
}

export enum ErrorStatusCode {
	'400_BAD_REQUEST' = 400,
	'401_UNAUTHENTICATED' = 401, // Not signed in
	'402_PAYMENT_REQUIRED' = 402,
	'403_FORBIDDEN' = 403, // Unauthorized
	'404_NOT_FOUND' = 404,
	'410_GONE' = 410, // Resource deleted
	'415_UNSUPPORTED_MEDIA_TYPE' = 415,
	'429_TOO_MANY_REQUESTS' = 429,
	'499_REFRESH_TOKEN_ERROR' = 499
}

export const successResponse = (
	httpsStatusCode: SuccessStatusCode,
	message: string,
	data: any,
	res: Response
): Response => {
	const resObj = {
		status: 'ok',
		code: httpsStatusCode,
		message,
		data
	};

	return res.status(httpsStatusCode).json(resObj);
};

export const errorResponse = (
	httpsStatusCode: ErrorStatusCode,
	message: string,
	res: Response
): Response => {
	const resObj = {
		status: 'error',
		code: httpsStatusCode,
		message
	};

	return res.status(httpsStatusCode).json(resObj);
};
