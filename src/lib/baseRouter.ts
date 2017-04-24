/**
 * API route definitions.
**/
import fs = require('fs');
import * as amqp from 'amqp-ts';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import { Router } from 'express';
import * as express from 'express';
import * as Joi from 'joi';
import * as process from 'process';
import * as uuid from 'uuid';
import { basePublisher } from './basePublisher';
import { RabbitConfig } from './baseRabbit';
import { TSBException } from './exception';
import { Guid } from './guid';
import { logger, LogLevel } from './logger';
import { validation } from './validation';

export class BaseRouter {

	public AppRouter: Router = Router();
	private _queues: amqp.Queue[] = [];

	public async addRoute(cfg: ITSBRoute): Promise<void> {
		await this.wireExpress(cfg);
	}

	public async addRabbit(cfg: ITSBRabbitRoute): Promise<void> {
		await this.wireRabbit(cfg);
	}

	public async addTimer(cfg: ITSBTimer): Promise<void> {
		await this.wireExpress({
			verb: cfg.verb,
			url: cfg.url,
			service: cfg.service,
			method: cfg.method,
			schema: {}
		});
		await this.wireTimer(cfg);
	}

	private async wireExpress(cfg: ITSBRoute): Promise<void> {
		let middlewares = [];
		let oid: string;
		middlewares.push(async (req, res, next) => {
			try {

				// auth & originatorId
				req._model = Object.assign({}, req.body, req.params, req.query);
				let auth = req.get('authorization');
				if (auth) {
					req._model._authorization = auth;
				}
				// permits
				if (cfg.permits) {
					// logger.log(oid, LogLevel.trace, 'token started');
					// await validation.validateToken(req.get('authorization'));
				}
				if (cfg.permits && cfg.permits.length > 0) {
					// req.body = req.body || {};
					// req.body._actions = cfg.permits;
					// logger.log(oid, LogLevel.trace, 'permission started');
					// let valid = await validation.validatePermissions(req, req.body._actions, oid);
					// if (!valid) {
					// 	logger.log(oid, LogLevel.trace, 'permission failed to validate');
					// 	res.status(401).send('Unauthorized');
					// 	return;
					// }
				}

				// model
				req._schema = cfg.schema;
				let joiOptions = {
					context: req,
					allowUnknown: true,
					abortEarly: false
				};

				let { error, value } = Joi.validate(req._model, req._schema, joiOptions);
				if (!error || error.details.length === 0) {
					logger.log(oid, LogLevel.debug, 'received http event', req._model);
					req._model = value;
				} else {
					let translatedErrors = [];
					error.details.forEach((err) => {
						translatedErrors.push({
							field: err.path,
							messages: [err.message]
						});
					});
					logger.log(oid, LogLevel.error, 'joi validation error', translatedErrors);
					res.status(400).send({ message: 'Bad Request', errors: translatedErrors });
					return;
				}

				// service
				let result = await cfg.service[cfg.method](req._model);
				logger.log(oid, LogLevel.info, 'response data', typeof result === 'object' ? result : { _result: result });
				res.status(200).send(result);
				return;
			} catch (err) {
				logger.log(oid, LogLevel.error, err.name, err);
				res.status(err.status || 500).send(err);
				return;
			}
		});

		this.AppRouter.route(process.env.SERVICE_PATH + cfg.url)[cfg.verb](middlewares);
	}

	private async wireRabbit(cfg: ITSBRabbitRoute): Promise<void> {
		try {

			if (cfg.queue === undefined || cfg.queue === null || cfg.queue.trim() === '') {
				throw 'value for rabbit.queue should not be blank.';
			}

			let q = cfg.config.connection.declareQueue(cfg.queue, { exclusive: cfg.exclusiveQueue });
			q.prefetch(1);
			await q.bind(cfg.config.exchange, cfg.key);

			q.activateConsumer(async (message: amqp.Message) => {
				try {
					let model;
					let schema = cfg.schema;
					model = message.getContent();
					if (cfg.novalidate === true) {
						await cfg.service[cfg.method](model);
					} else {
						let joiOptions = {
							context: model,
							allowUnknown: true,
							abortEarly: false
						};
						let { error, value } = Joi.validate(model, schema, joiOptions);
						if (!error || error.details.length === 0) {
							logger.log(model.header.originatorId, LogLevel.trace, 'recieved event', model);
							await cfg.service[cfg.method](model);
						} else {
							logger.log(model.header.originatorId, LogLevel.error, 'joi validation error', error);
						}
					}
					message.ack();
				} catch (err) {
					logger.log(err.originatorId, LogLevel.error, err.name, err);
					if (err.name && err.name === 'TSBDependencyException') {
						message.nack();
					}
					else {
						message.ack();
					}
				}
			});
			this._queues.push(q);
		} catch (err) {
			logger.log(err.originatorId, LogLevel.error, err.name, err);
		}
	}

	private async wireTimer(cfg: ITSBTimer): Promise<void> {
		setInterval(async () => {
			try {
				let model = { header: { originatorId: Guid.new() } };
				logger.log(model.header.originatorId, LogLevel.trace, `Timer for '${cfg.url}' fired`);
				let result = await cfg.service[cfg.method](model);
				logger.log(model.header.originatorId, LogLevel.info, 'response data', typeof result === 'object' ? result : { _result: result });
			} catch (err) {
				logger.log(err.originatorId, LogLevel.error, err.name, err);
			}
		}, cfg.interval);
	}

}

export interface ITSBRoute {
	verb: 'get' | 'post' | 'put' | 'delete';
	url: string;
	service: {};
	method: string;
	schema: {};
	permits?: string[];
	novalidate?: boolean;
}

export interface ITSBTimer {
	verb: 'get' | 'post' | 'put' | 'delete';
	url: string;
	service: {};
	method: string;
	interval: number;
}

export interface ITSBRabbitRoute {
	config: RabbitConfig;
	service: {};
	method: string;
	queue: string;
	key: string;
	exclusiveQueue?: boolean;
	schema: {};
	novalidate?: boolean;
}