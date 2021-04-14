import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { json, urlencoded } from 'body-parser';
import cookieParser from 'cookie-parser';
import { config, DotenvConfigOptions, DotenvParseOptions } from 'dotenv';

import authRoutes from './routes/auth';
import weatherRoutes from './routes/weather';
import newsRoutes from './routes/news';
import log from './utils/logger';
import connectDatabase from './utils/database';
import handleError from './middlewares/error';
// App Class for express application
class App {
	public app: express.Application;

	constructor() {
		this.app = express();
		this.init();
	}

	private async init(): Promise<void> {
		if (process.env.NODE_ENV === 'development') {
			const dotEnvConfigOptions: DotenvConfigOptions = {
				path: `${__dirname}/../.env.dev`
			};

			config(dotEnvConfigOptions);
		} else {
			const dotEnvConfigOptions: DotenvConfigOptions = {
				path: `${__dirname}/../.env`
			};

			config(dotEnvConfigOptions);
		}

		this.app.set('port', process.env.PORT ?? 3000);
		this.app.use(cors());
		this.app.use(helmet());
		this.app.use(urlencoded({ extended: false }));
		this.app.use(json());
		this.app.use(cookieParser(process.env.COOKIE_SECRET ?? ''));
		this.app.use(authRoutes);
		this.app.use(weatherRoutes);
		this.app.use(newsRoutes);
		this.app.use(handleError);

		connectDatabase()
			.then((db) => {
				// When successfully connected
				log.info('Connected to the database');

				// CONNECTION EVENTS
				// When the connection is disconnected
				db.connection.on('disconnected', () => {
					log.error('Database disconnected');
				});

				// If the connection throws an error
				db.connection.on('error', (err) => {
					log.error(`Database connection error`);
					log.error(err);
				});

				// If the Node process ends, close the Mongoose connection
				process.on('SIGINT', () => {
					db.connection.close(() => {
						process.exit(0);
					});
				});
			})
			.catch((error) => {
				log.error(
					'Something went wrong while connecting to the database'
				);
			});
	}
}

// Create express application instance
const { app } = new App();
app.listen(app.get('port'), () => {
	log.info(`Server is running on port: ${app.get('port')}`);
});
