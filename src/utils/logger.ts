import { createLogger, format, transports, Logger } from 'winston';

const logLevel = 'debug';

// Winston logger instance
const logger: Logger = createLogger({
	transports: [
		new transports.Console({
			level: logLevel,
			format: format.combine(
				format.errors({ stack: true }),
				format.timestamp(),
				format.colorize({
					colors: { info: 'cyan', error: 'red', warn: 'yellow' }
				}),
				format.simple(),
				format.printf(
					(logInfo) =>
						`${logInfo.timestamp} ${logInfo.level}: ${logInfo.message}`
				)
			)
		})
	],
	exitOnError: false // Do not exit on handled exceptions
});

export default logger;
