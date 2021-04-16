import { NextFunction, Request, Response } from 'express';
import { DateTime } from 'luxon';

import { User, UserDocument } from '../models/user';
import { createRefreshToken, createAccessToken } from '../utils/auth';
import AppError from '../utils/error';
import {
	ErrorStatusCode,
	successResponse,
	SuccessStatusCode
} from '../utils/response';

const emailRegex = /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

// Signup Controller
export const signup = () => async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response | void> => {
	try {
		const {
			name,
			email,
			password
		}: {
			name: string;
			email: string;
			password: string;
		} = req.body;

		// If name is ane empty string or has length greater than 30 characters, throw an error
		if (name === '' || name.length > 30) {
			throw new AppError(
				ErrorStatusCode['400_BAD_REQUEST'],
				'name must be min 1 and max 30 characters long'
			);
		}

		// If email is invalid, throw an error
		if (!emailRegex.test(email)) {
			throw new AppError(
				ErrorStatusCode['400_BAD_REQUEST'],
				'Invalid email'
			);
		}

		// IF password length is less than 8 characters, throw an error
		if (password.length < 8) {
			throw new AppError(
				ErrorStatusCode['400_BAD_REQUEST'],
				'Password must be min 8 characters long'
			);
		}

		const userData = {
			name,
			email,
			password
		};

		// Save data to the users collection in the mongodb database
		await User.create(userData);

		return successResponse(
			SuccessStatusCode['201_CREATED'],
			'Signup successful',
			{
				isSignedUp: true
			},
			res
		);
	} catch (error) {
		return next(error);
	}
};

// Login Controller
export const login = () => async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response | void> => {
	try {
		const {
			email,
			password
		}: {
			email: string;
			password: string;
		} = req.body;

		// If email is invalid, throw an error
		if (!emailRegex.test(email)) {
			throw new AppError(
				ErrorStatusCode['400_BAD_REQUEST'],
				'Invalid email'
			);
		}

		// If the length of password is less than 8 characters, throw an error
		if (password.length < 8) {
			throw new AppError(
				ErrorStatusCode['400_BAD_REQUEST'],
				'Password must be atleast 8 characters long'
			);
		}

		const dataFilter = {
			email
		};

		const dataFields = {
			_id: 1,
			name: 1,
			email: 1,
			password: 1,
			refreshToken: 1
		};

		// Search for the registered user in the database
		const user = await User.findOne(dataFilter, dataFields);

		// If user data is not found in the database, throw an error
		if (!user) {
			throw new AppError(
				ErrorStatusCode['404_NOT_FOUND'],
				'Email not registered'
			);
		}

		// Compare password provided by user with the password hash in the database
		const isPasswordMatch = await user?.comparePassword(password);

		// If password does not match, throw an error
		if (!isPasswordMatch) {
			throw new AppError(
				ErrorStatusCode['400_BAD_REQUEST'],
				'Password does not match'
			);
		}

		// Create refresh token
		const refreshToken = createRefreshToken();

		// Set refresh token as the signed HTTP only cookie in the response headers
		res.cookie('rt', refreshToken, {
			httpOnly: true,
			signed: true
		});

		// Create JWT access token
		const accessToken = createAccessToken({
			id: user.get('_id')
		});

		// Set the access token as the bearer token in the response headers
		res.setHeader('Authorization', `Bearer ${accessToken}`);

		// Update the refresh token in the database
		await User.updateOne(
			{
				email
			},
			{
				$push: {
					devices: {
						refreshToken,
						expiresAt: DateTime.now().plus({ months: 1 }).toJSDate()
					}
				}
			}
		);

		return successResponse(
			SuccessStatusCode['200_OK'],
			'Login successful',
			{
				isLoggedIn: true
			},
			res
		);
	} catch (error) {
		return next(error);
	}
};

// Logout Controller
export const logout = () => async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response | void> => {
	try {
		const { user }: { user: UserDocument } = req.body;
		const { rt } = req.signedCookies;

		// Remove the refresh token from the database
		await user.update({
			$pull: {
				devices: {
					refreshToken: rt
				}
			}
		});

		return successResponse(
			SuccessStatusCode['204_NO_CONTENT'],
			'Logout successful',
			{
				isLoggedOut: true
			},
			res
		);
	} catch (error) {
		return next(error);
	}
};

// Session Refresh Controller
export const refreshSession = () => async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response | void> => {
	try {
		const { decoded, user, deviceIndex } = req.body;
		const { rt } = req.signedCookies;

		// Create a new refresh token
		const refreshToken = createRefreshToken();

		// Set refresh token as the signed HTTP only cookie in the response headers
		res.cookie('rt', refreshToken, {
			httpOnly: true,
			signed: true
		});

		// Create a new JWT access token
		const accessToken = createAccessToken({
			id: user.get('_id')
		});

		// Set the access token as the bearer token in the response headers
		res.setHeader('Authorization', `Bearer ${accessToken}`);

		// Remove the old refresh token from the database and update the new refresh token in the database
		(user.devices as Array<any>).splice(deviceIndex);
		(user.devices as Array<any>).push({
			refreshToken,
			expiresAt: DateTime.now().plus({ months: 1 }).toJSDate()
		});

		await User.updateOne(
			{
				_id: decoded.id
			},
			{
				$set: {
					devices: user.devices
				}
			}
		);

		return successResponse(
			SuccessStatusCode['204_NO_CONTENT'],
			'Session refresh successful',
			{
				isRefreshed: true
			},
			res
		);
	} catch (error) {
		return next(error);
	}
};
