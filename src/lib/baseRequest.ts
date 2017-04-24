import * as express from 'express';
import * as request from 'request-promise';

export class WebRequest {

	public json: boolean = true;

	/**
	 * Shortcut for creating a web request object
	 * @param url for endpoint
	 * @param body to send on PUT/POST
	 */
	constructor(
		public url: string,
		public body: any) { // tslint:disable-line:no-any
		}

}