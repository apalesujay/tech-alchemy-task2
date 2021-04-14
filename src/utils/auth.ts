import { v4 } from 'uuid';
import { sign, SignOptions, verify, VerifyOptions } from 'jsonwebtoken';
import AppError from './error';
import { ErrorStatusCode } from './response';

const secretKey = process.env.JWT_SECRET ?? '';

export const createRefreshToken = (): string => {
	const refreshToken = v4();

	return refreshToken;
};

export const createAccessToken = (payload: any): string => {
	const signOptions: SignOptions = {
		algorithm: 'HS512',
		expiresIn: 3600
	};

	const jwt = sign(payload, secretKey, signOptions);

	return jwt;
};

export const verifyAccessToken = (
	jwt: string,
	ignoreExpiration?: true
): any => {
	const verifyOptions: VerifyOptions = {
		algorithms: ['HS512'],
		ignoreExpiration
	};

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
