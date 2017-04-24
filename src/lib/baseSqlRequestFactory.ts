import * as mssql from 'mssql';

export class BaseSqlRequestFactory {

	/**
	 * Creates a factory for getting a mssql connection
	 * in a ready to use state.
	 * @param connection object from mssql
	 */
	constructor(private connection: mssql.Connection) { }

	public async getConnectedRequest(): Promise<mssql.Request> {
		if (!this.connection.connected) {
			await this.connection.connect();
		}

		return new mssql.Request(this.connection);
	}
}
