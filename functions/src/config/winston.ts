// https://www.digitalocean.com/community/tutorials/how-to-use-winston-to-log-node-js-applications
import { Logger } from 'winston';
import winston = require('winston');

// define the custom settings for each transport (file, console)
const options = {
    console: {
        level: 'debug',
        handleExceptions: true,
        json: false,
        colorize: true,
    },
};

// instantiate a new Winston Logger with the settings defined above
const logger: Logger = winston.createLogger({
    transports: [new winston.transports.Console(options.console)],
    exitOnError: false, // do not exit on handled exceptions
});

/**
 * To pipe 'morgan' logs to winston
 * https://stackoverflow.com/a/51918846
 */
export class LoggerStream {
    write(message: string): void {
        logger.info(message.substring(0, message.lastIndexOf('\n')));
    }
}

export default logger;
