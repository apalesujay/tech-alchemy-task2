import LRU from 'lru-cache';

const cacheOptions = {
	max: 500,
	maxAge: 1000 * 60 * 60
};

const cache = new LRU(cacheOptions);

export const getData = (key: string): any => {
	const data = cache.get(key);

	return data;
};

export const setData = (key: string, value: any): boolean => {
	const isSet = cache.set(key, value);

	return isSet;
};
