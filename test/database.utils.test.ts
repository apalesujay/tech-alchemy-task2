import { describe, test, expect } from '@jest/globals';
import { Mongoose } from 'mongoose';
import createConnection from '../src/utils/database';

describe('createConnection Function', () => {
	test('Should connect to the database', async (done) => {
		const db = await createConnection();

		expect(db).toBeInstanceOf(Mongoose);
		expect(
			db.connection.host === 'sanbox-shard-00-00.b4fr8.mongodb.net' ||
				db.connection.host === 'sanbox-shard-00-01.b4fr8.mongodb.net' ||
				db.connection.host === 'sanbox-shard-00-02.b4fr8.mongodb.net'
		).toBeTruthy();
		expect(db.connection.name).toEqual('sandoxdb');

		await db.connection.close();
		if (done) {
			done();
		}
	});
});
