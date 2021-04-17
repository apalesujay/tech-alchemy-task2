import { describe, test, expect } from '@jest/globals';

import { createHash, compareHash } from '../src/utils/hash';

describe('createHash Function', () => {
	test('Should return a valid bcrypt hash string', async () => {
		const data = 'password987';
		const hash = await createHash(data);
		const bcryptHashRegex = /^[$]2[abxy]?[$](?:0[4-9]|[12][0-9]|3[01])[$][./0-9a-zA-Z]{53}$/;

		expect(hash).toEqual(expect.stringMatching(bcryptHashRegex));
	});
});

describe('comapreHash Function', () => {
	test('Should return true for two matching hashes', async () => {
		const data = 'password987';
		const hash = await createHash(data);
		const isMatch = await compareHash(data, hash);

		expect(isMatch).toBeTruthy();
	});
});

describe('comapreHash Function', () => {
	test('Should return false for two not matching hashes', async () => {
		const data1 = 'password987';
		const data2 = 'password123';
		const hash = await createHash(data1);
		const isMatch = await compareHash(data2, hash);

		expect(isMatch).toBeFalsy();
	});
});
