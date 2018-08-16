import winston from 'winston';
import { TransformableInfo } from 'logform';

const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf( (info: TransformableInfo) => `
${info.timestamp} [${info.level}]: ${info.message}`),
    ),

    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'combined.log' }),
    ],
});

export default logger;
