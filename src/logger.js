import winston from 'winston';

const levelLabels = {
  error: 'ERR',
  warn: 'WRN',
  info: 'INF',
  debug: 'DGB',
  verbose: 'VERB'
};

winston.addColors({
  error: 'red',
  warn: 'yellow',
  info: 'green',
  debug: 'cyan',
  verbose: 'blue' 
});

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format((info) => {
      info.level = levelLabels[info.level] || info.level.toUpperCase();
      return info;
    })(),
    winston.format.colorize({ level: true }),
    winston.format.printf(({ level, message, timestamp }) => {
      return `[${timestamp}][${level}] ${message}`;
    })
  ),
});

export const LOGD = (message) => logger.debug(message);
export const LOGI = (message) => logger.info(message);
export const LOGW = (message) => logger.warn(message);
export const LOGE = (message) => logger.error(message);

if (!globalThis.LOGD) globalThis.LOGD = LOGD;
if (!globalThis.LOGI) globalThis.LOGI = LOGI;
if (!globalThis.LOGW) globalThis.LOGW = LOGW;
if (!globalThis.LOGE) globalThis.LOGE = LOGE;
