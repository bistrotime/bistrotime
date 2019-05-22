import { createLogger, format, transports } from 'winston';
import config from 'config';

const ignoreTestEnvironment = format((info) => {
  if (process.env.NODE_ENV === 'test') {
    return false;
  }
  return info;
});

const logger = createLogger({
  level: config.get('level'),
  format: format.combine(
    ignoreTestEnvironment(),
    format.splat(),
    format.colorize(),
    format.simple(),
  ),
  transports: [new transports.Console()],
  exitOnError: false,
});

logger.stream = {
  write: (message) => {
    logger.info(message.substring(0, message.lastIndexOf('\n')));
  },
};

export default logger;
