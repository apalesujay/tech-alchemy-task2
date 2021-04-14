import { hash, compare } from 'bcrypt';

export const createHash = async (data: any): Promise<string> => {
	const rounds = 10;
	const hashed = await hash(data, rounds);

	return hashed;
};

export const compareHash = async (
	data: any,
	hashedString: string
): Promise<boolean> => {
	const isMatch = await compare(data, hashedString);

	return isMatch;
};
