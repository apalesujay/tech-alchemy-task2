import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { urlencoded, json } from 'body-parser';

import log from './utils/logger';

// App Class for express application
class App {
	public app: express.Application;

	constructor() {
		this.app = express();
		this.init();
	}

	private init(): void {
		this.app.set('port', process.env.port || 3000);
		this.app.use(cors());
		this.app.use(helmet());
		this.app.use(urlencoded({ extended: false }));
		this.app.use(json());
	}
}

// Create express application instance
const { app } = new App();
app.listen(app.get('port'), () => {
	log.info(`Server is running on port: ${app.get('port')}`);
});
