import { logger, LogLevel } from './logger';
import mongoose = require('mongoose');

export class MongoConfig {

	/**
	 * Create a connection MONGO_{dbname}_URI
	 * @param dbName used to contruct connection string
	 */
	public static construct(dbName: string): mongoose.Connection {
		let connection = mongoose.createConnection(process.env[`MONGO_${dbName.toUpperCase()}_URI`]);
		connection.on('connected', () => {
			logger.log(LogLevel.trace, `Trying to establish a connection to ${dbName} mongoDB.`);
		});

		connection.on('connecting', () => {
			logger.log(LogLevel.trace, `Established a connection to ${dbName} mongoDB.`);
		});

		connection.on('error', (err) => {
			logger.log(LogLevel.fatal, `Connection to ${dbName} mongoDB failed with the following error: ${err}`);
		});

		connection.on('disconnected', () => {
			logger.log(LogLevel.fatal, `Connection to ${dbName} mongoDB closed.`);
		});

		connection.on('disconnecting', () => {
			logger.log(LogLevel.trace, `Trying to disconnect from ${dbName} mongoDB.`);
		});

		connection.on('unauthorized', () => {
			logger.log(LogLevel.fatal, `Unauthorized connection to ${dbName} mongoDB.`);
		});

		connection.on('uninitialized', () => {
			logger.log(LogLevel.fatal, `Connection attempt failed to uninitialized ${dbName} mongoDB.`);
		});
		return connection;
	}
}