import { describe, test, expect } from '@jest/globals';

import { getData, setData } from '../src/utils/cache';

const key = 'someKey';
const value = 'someValue';

describe('setData Function', () => {
	test('Should return true on successfully storing the data into cache', () => {
		const isStored = setData(key, value);

		expect(isStored).toBeTruthy();
	});
});

describe('getData Function', () => {
	test('Should return the value of the key', () => {
		const data = getData(key);

		expect(data).toEqual(value);
	});
});
