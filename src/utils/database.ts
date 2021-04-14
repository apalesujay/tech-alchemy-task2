import { connect, ConnectionOptions, Mongoose } from 'mongoose';

const createConnection = (): Promise<Mongoose> =>
	new Promise(async (resolve, reject) => {
		try {
			const dbUri =
				'mongodb+srv://tempUser:p1a2s3s4w5o6r7d8@sanbox.b4fr8.mongodb.net/sandoxdb?retryWrites=true&w=majority';

			// Database Connection options
			const databaseOptions: ConnectionOptions = {
				useNewUrlParser: true,
				useCreateIndex: true,
				useUnifiedTopology: true,
				useFindAndModify: false,
				autoIndex: true,
				poolSize: 10, // Maintain up to 10 socket connections
				bufferMaxEntries: 0, // If not connected, return errors immediately rather than waiting to reconnect
				connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
				socketTimeoutMS: 45000 // Close sockets after 45 seconds of inactivity
			};
			const db = await connect(dbUri, databaseOptions);

			return resolve(db);
		} catch (error) {
			return reject(error);
		}
	});

export default createConnection;
