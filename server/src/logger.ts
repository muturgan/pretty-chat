import winston from 'winston';
import { TransformableInfo } from 'logform';

export const logger = winston.createLogger({
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

export const errorString = (error: {[key: string]: any}): string => {
    let str = '';
    for (let key in error) {
        str += `${key}: ${error[key]}; `;
    }
    return str;
};
