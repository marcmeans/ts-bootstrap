/**
 * Bootstraps our node/express application and
 * allows us to initiate a server.
**/
import * as fs from 'fs';
import * as http from 'http';

export class Server {

	constructor(private server: http.Server) { }

	public startServer(): void {
		this.serverListener();
	}

	private serverListener(): void {
		this.server.listen(process.env.PORT, () => {
			// tslint:disable-next-line:no-console
			console.log(JSON.parse(fs.readFileSync('package.json', 'utf8')).name + ' listening on :' + process.env.PORT + process.env.SERVICE_PATH + ' in ' + process.env.NODE_ENV + ' mode');
		});
	}
}
