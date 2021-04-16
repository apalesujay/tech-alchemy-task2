import { Response } from 'express';

// Success reponse code
export enum SuccessStatusCode {
	'200_OK' = 200,
	'201_CREATED' = 201,
	'204_NO_CONTENT' = 200
}

// Error response code
export enum ErrorStatusCode {
	'400_BAD_REQUEST' = 400,
	'401_UNAUTHENTICATED' = 401, // Not signed in
	'403_FORBIDDEN' = 403, // Unauthorized
	'404_NOT_FOUND' = 404,
	'499_REFRESH_TOKEN_ERROR' = 499
}

// Function to handle success Response
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

// Function to handle error response
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
