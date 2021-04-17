import { describe, test, expect } from '@jest/globals';
import { DateTime } from 'luxon';
import { Types } from 'mongoose';

import {
	createRefreshToken,
	createAccessToken,
	verifyAccessToken
} from '../src/utils/auth';
import AppError from '../src/utils/error';

describe('createRefreshToken Function', () => {
	test('Should return a valid UUID v4 string', () => {
		const uuidV4Regex = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
		const refreshToken = createRefreshToken();

		expect(refreshToken).toEqual(expect.stringMatching(uuidV4Regex));
	});
});

describe('createAccessToken Function', () => {
	test('Should return a valid JWT string', () => {
		const sampleObjectId = Types.ObjectId();
		const jwt = createAccessToken({ id: sampleObjectId });
		const jwtSplit = jwt.split('.');

		expect(jwtSplit).toHaveLength(3);
	});
});

describe('verifyAccessToken Function', () => {
	test('Should return a decoded object', () => {
		const sampleObjectId = Types.ObjectId();
		const jwt = createAccessToken({ id: sampleObjectId });
		const decoded = verifyAccessToken(jwt);

		expect(decoded).toHaveProperty('id', String(sampleObjectId));
		expect(decoded).toHaveProperty('iat');
		expect(decoded).toHaveProperty('exp');
	});

	test('Should throw an error for invalid JWT', () => {
		const sampleObjectId = Types.ObjectId();
		const jwt = createAccessToken({ id: sampleObjectId });
		const invalidJWT = `${jwt}1`;
		try {
			verifyAccessToken(invalidJWT);
		} catch (error) {
			expect(error).toBeInstanceOf(AppError);
		}
	});

	test('Should ignore the expiry time of JWT', () => {
		const expiredJWT =
			'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwNzVjNGI5YWNmYTk4NTFlYmY4MWQ4ZiIsImlhdCI6MTYxODM5MjA3NCwiZXhwIjoxNjE4Mzk1Njc0fQ.0UF-37F_VuGaj0IbQtpp_0Ojewv5IIiSpaMCTCmAjbeXtwrGwTZU51MCEtJDMa1J0bZniFeulmgOzdNdsZ200g';

		const decoded = verifyAccessToken(expiredJWT, true);

		const { exp } = decoded;

		expect(exp).toBeLessThan(DateTime.now().toMillis() / 1000);
	});
});
