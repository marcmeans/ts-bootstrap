import { logger, LogLevel } from './logger';
import mongoose = require('mongoose');

export class MongoConfig {

	public static construct(dbName: string): mongoose.Connection {
		let connection = mongoose.createConnection(process.env[`MONGO_${dbName.toUpperCase()}_URI`]);
		connection.on('connected', () => {
			logger.log('mongoose', LogLevel.trace, `Trying to establish a connection to ${dbName} mongoDB.`);
		});

		connection.on('connecting', () => {
			logger.log('mongoose', LogLevel.trace, `Established a connection to ${dbName} mongoDB.`);
		});

		connection.on('error', (err) => {
			logger.log('mongoose', LogLevel.fatal, `Connection to ${dbName} mongoDB failed with the following error: ${err}`);
		});

		connection.on('disconnected', () => {
			logger.log('mongoose', LogLevel.fatal, `Connection to ${dbName} mongoDB closed.`);
		});

		connection.on('disconnecting', () => {
			logger.log('mongoose', LogLevel.trace, `Trying to disconnect from ${dbName} mongoDB.`);
		});

		connection.on('unauthorized', () => {
			logger.log('mongoose', LogLevel.fatal, `Unauthorized connection to ${dbName} mongoDB.`);
		});

		connection.on('uninitialized', () => {
			logger.log('mongoose', LogLevel.fatal, `Connection attempt failed to uninitialized ${dbName} mongoDB.`);
		});
		return connection;
	}
}