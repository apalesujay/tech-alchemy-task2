import { NextFunction, Request, Response } from 'express';
import { verifyAccessToken } from '../utils/auth';
import { User } from '../models/user';
import AppError from '../utils/error';
import { ErrorStatusCode } from '../utils/response';

const auth = (ignoreExpiration?: true) => async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response<any> | void> => {
	try {
		const bearerToken = req.headers.authorization;

		const { rt } = req.signedCookies;

		// If bearerToken is present
		if (bearerToken) {
			// If bearerToken starts with the string 'Bearer'
			if (bearerToken.startsWith('Bearer')) {
				// Split the bearer token by space and get only the actual JWT
				const token: string = bearerToken.split(' ')[1];

				// Throw error if token is an empty string
				if (token.trim() === '') {
					throw new AppError(
						ErrorStatusCode['400_BAD_REQUEST'],
						'Access token is an empty string'
					);
				}

				// Else verify jwt
				const decoded = await verifyAccessToken(
					token,
					ignoreExpiration
				);

				// Add body of the jwt to req.decoded
				req.body.decoded = decoded;

				// Find user from the database
				const user = await User.findById(decoded.id);

				// Throw error if no user found
				if (!user) {
					throw new AppError(
						ErrorStatusCode['404_NOT_FOUND'],
						'User not found'
					);
				}

				// Else store user in req.user
				req.body.user = user;

				const { devices } = req.body.user;

				// Verify refresh token
				const deviceIndex = devices.findIndex(
					(device: any) => device.refreshToken === rt
				);

				req.body.deviceIndex = deviceIndex;

				// Throw error if the refresh token is not found in the database
				if (deviceIndex === -1) {
					throw new AppError(
						ErrorStatusCode['499_REFRESH_TOKEN_ERROR'],
						'Refresh token not found in the database'
					);
				}

				// Throw error if the refresh token is expired
				if (new Date(devices[deviceIndex].expiresAt) < new Date()) {
					throw new AppError(
						ErrorStatusCode['499_REFRESH_TOKEN_ERROR'],
						'Session expired'
					);
				}

				return next();
			}
			// Else throw error if not the bearer authorization scheme
			throw new AppError(
				ErrorStatusCode['400_BAD_REQUEST'],
				'Invalid authorization scheme'
			);
		}

		// Else throw error if token not found
		throw new AppError(
			ErrorStatusCode['400_BAD_REQUEST'],
			'Access token is required'
		);
	} catch (error) {
		return next(error);
	}
};

export default auth;
