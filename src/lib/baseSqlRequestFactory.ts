import * as mssql from 'mssql';

export class BaseSqlRequestFactory {

	constructor(private connection: mssql.Connection) { }

	public async getConnectedRequest(): Promise<mssql.Request> {
		if (!this.connection.connected) {
			await this.connection.connect();
		}

		return new mssql.Request(this.connection);
	}
}
