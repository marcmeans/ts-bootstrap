import * as express from 'express';
import * as request from 'request-promise';

export class WebRequest {

	public headers: {};
	public json: boolean = true;
	constructor(
		public url: string,
		public body: any, // tslint:disable-line:no-any
		private baseEvent: any) { // tslint:disable-line:no-any
		this.headers = { 'originatorId': baseEvent.header.originatorId }; // tslint:disable-line:object-literal-key-quotes
	}

}