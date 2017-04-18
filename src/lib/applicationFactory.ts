/**
 * Factory pattern to create a new instance of our node/express application.
 */
// tslint:disable:no-any
import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as console from 'console';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as methodOverride from 'method-override';
import { TSBException } from './exception';

export class ApplicationFactory {

	// ref to Express instance
	public express: express.Application;

	// Run configuration methods on the Express instance.
	constructor(builder: any) {
		this.express = express();
		this.middleware();
		this.routes(builder);
		this.exceptionHandling();
	}

	// Configure Express middleware.
	private middleware(): void {
		this.express.use(compression());
		this.express.use(bodyParser.urlencoded({ extended: false }));
		this.express.use(bodyParser.json());
		this.express.use(cors());
		this.express.use(methodOverride());
		this.express.use(cookieParser());
		let serveDir = process.env.TSB_STATIC_DIR ? process.env.TSB_STATIC_DIR : `./public`;
		this.express.use(process.env.SERVICE_PATH , express.static(serveDir));
	}

	// Configure API endpoints.
	private routes(builder: any): void {
		builder.bootstrap();
		this.express.use('/', builder.AppRouter);
	}

	// Configure global error handling
	private exceptionHandling(): void {
		// this.express.use(errorHandler);
	}

}