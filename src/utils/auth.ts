import { v4 } from 'uuid';
import { sign, SignOptions, verify, VerifyOptions } from 'jsonwebtoken';
import AppError from './error';
import { ErrorStatusCode } from './response';

// Function to create a refresh token
export const createRefreshToken = (): string => {
	const refreshToken = v4();

	return refreshToken;
};

// Function to create a JWT access token
export const createAccessToken = (payload: any): string => {
	const signOptions: SignOptions = {
		algorithm: 'HS512',
		expiresIn: 3600
	};

	const secretKey = process.env.JWT_SECRET ?? '';

	const jwt = sign(payload, secretKey, signOptions);

	return jwt;
};

// Function to verify the JWT access token
export const verifyAccessToken = (
	jwt: string,
	ignoreExpiration?: true
): any => {
	const verifyOptions: VerifyOptions = {
		algorithms: ['HS512'],
		ignoreExpiration
	};

	const secretKey = process.env.JWT_SECRET ?? '';

	return verify(jwt, secretKey, verifyOptions, (error, decoded) => {
		if (error) {
			if (error.name === 'TokenExpiredError') {
				throw new AppError(
					ErrorStatusCode['401_UNAUTHENTICATED'],
					'Access token expired'
				);
			}

			throw new AppError(
				ErrorStatusCode['400_BAD_REQUEST'],
				'Invalid access token'
			);
		}

		return decoded;
	});
};
