import * as fs from 'fs';

export interface ILogger {
	logName: string;
	log(level: LogLevel, message: string, detail?: {}): void; // tslint:disable-line:no-any
}

export class Logger implements ILogger {

	private _levels: {} = {
		trace: 50,
		debug: 40,
		info: 30,
		warn: 20,
		error: 10,
		fatal: 0
	};

	private _currentLevel: number = 30;

	/**
	 * @param logName to identify the application
	 */
	constructor(public logName: string) {

		switch (process.env.TSB_LOGGING_LEVEL) {
			case 'trace':
				this._currentLevel = 50;
				break;
			case 'debug':
				this._currentLevel = 40;
				break;
			case 'info':
				this._currentLevel = 30;
				break;
			case 'warn':
				this._currentLevel = 20;
				break;
			case 'error':
				this._currentLevel = 10;
				break;
			case 'fatal':
				this._currentLevel = 0;
				break;
			default:
				this._currentLevel = 30;
				break;
		}
		console.log(`Initialized ${logName} logger at level: ${LogLevel[this._currentLevel]}`); // tslint:disable-line:no-console
	}

	/**
	 *
	 * @param level used for severity
	 * @param message string message to display in log
	 * @param detail object used for tracking details in the log
	 */
	public log(level: LogLevel, message: string, detail?: any): void { // tslint:disable-line:no-any
		if (this._currentLevel < level) {
			return;
		} else {
			let plainObject;
			if (detail instanceof TypeError) {
				plainObject = { message: detail.toString() };
			} else {
				plainObject = detail;
			}
			let pretty = process.env.NODE_ENV === 'LOCAL' ? '\t' : undefined;
			let formattedMessage = JSON.stringify({ severity: LogLevel[level], message, detail: plainObject }, null, pretty);
			console.log(formattedMessage); // tslint:disable-line:no-console
		}
	}
}

export enum LogLevel {
	trace = 50,
	debug = 40,
	info = 30,
	warn = 20,
	error = 10,
	fatal = 0
}

export const logger = new Logger(JSON.parse(fs.readFileSync('package.json', 'utf8')).name);