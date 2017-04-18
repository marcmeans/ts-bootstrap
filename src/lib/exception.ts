// tslint:disable:max-classes-per-file
import * as express from 'express';
import { logger, LogLevel } from './logger';

export abstract class BaseExecption extends Error {
	public abstract status: number;

	constructor(
		public readonly originatorId: string,
		public readonly clientMessage: string,
		public readonly detail?: {}) {
		super();
	}
}

export class TSBException extends BaseExecption {

	public readonly status: number = 500;

	constructor(
		public readonly originatorId: string,
		public readonly clientMessage: string,
		public readonly detail?: {}
	) {
		super(originatorId, clientMessage, detail);
		this.name = 'TSBException';
	}
}

export class TSBNotFoundException extends BaseExecption {

	public readonly status: number = 404;

	constructor(
		public readonly originatorId: string,
		public readonly clientMessage: string,
		public readonly detail?: {}
	) {
		super(originatorId, clientMessage, detail);
		this.name = 'TSBNotFoundException';
	}
}

export class TSBNotAuthorizedException extends BaseExecption {
	public readonly status: number = 401;

	constructor(
		public readonly originatorId: string,
		public readonly clientMessage: string,
		public readonly detail?: {}
	) {
		super(originatorId, clientMessage, detail);
		this.name = 'TSBNotAuthorizedException';
	}
}

export class TSBDependencyException extends BaseExecption {
	public readonly status: number = 503;

	constructor(
		public readonly originatorId: string,
		public readonly clientMessage: string,
		public readonly detail?: {}
	) {
		super(originatorId, clientMessage, detail);
		this.name = 'TSBDependencyException';
	}
}

export class TSBPoisonException extends BaseExecption {
	public readonly status: number = 505;

	constructor(
		public readonly originatorId: string,
		public readonly clientMessage: string,
		public readonly detail?: {}
	) {
		super(originatorId, clientMessage, detail);
		this.name = 'TSBPoisonException';
	}
}