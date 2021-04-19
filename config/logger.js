const winston = require('winston');

module.exports = {
    info: winston.createLogger({
        transports: [
            new winston.transports.File({
                filename: 'logs/info.log',
                level: 'info',
                format: winston.format.combine(winston.format.timestamp(), winston.format.json())
            }),
        ]
    }),
    error: winston.createLogger({
        transports: [
            new winston.transports.File({
                filename: 'logs/error.log',
                level: 'error',
                format: winston.format.combine(winston.format.timestamp(), winston.format.json())
            }),
        ]
    }),
    http: winston.createLogger({
        transports: [
            new winston.transports.File({
                filename: 'logs/http.log',
                level: 'http',
                format: winston.format.combine(winston.format.timestamp(), winston.format.json())
            }),
        ]
    })
}