import winston from 'winston';

const transports = [];

if (process.env.NODE_ENV === 'production') {
  // In production (GCP Cloud Run), log to console (stdout) in JSON format.
  // GCP Cloud Logging captures console output automatically.
  transports.push(new winston.transports.Console());
} else {
  // In development, log to console with colors and write to local files
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
  transports.push(
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' })
  );
  transports.push(
    new winston.transports.File({ filename: 'logs/combined.log' })
  );
}

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'auth-api' },
  transports,
});

export default logger;
