import { hash, compare } from 'bcrypt';

// Function to create a bcrypt hash
export const createHash = async (data: any): Promise<string> => {
	const rounds = 10;
	const hashed = await hash(data, rounds);

	return hashed;
};

// Function to compare the hash with the data
export const compareHash = async (
	data: any,
	hashedString: string
): Promise<boolean> => {
	const isMatch = await compare(data, hashedString);

	return isMatch;
};
