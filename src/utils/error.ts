import { ErrorStatusCode } from './response';

// Custom class for Errors
class AppError extends Error {
	httpStatusCode: ErrorStatusCode;

	constructor(httpStatusCode: ErrorStatusCode, message: string) {
		super(message);
		this.httpStatusCode = httpStatusCode;
	}
}

export default AppError;
