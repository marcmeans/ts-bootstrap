import * as amqp from 'amqp-ts';
import { IBaseHeader } from './baseHeader';
import { RabbitConfig } from './baseRabbit';
import { logger, LogLevel } from './logger';

export class BasePublisher {

	public async send(rabbit: RabbitConfig, msg: { header: IBaseHeader }): Promise<void> {
		await rabbit.connection.completeConfiguration();
		let raisedEvent = new amqp.Message(msg);
		rabbit.exchange.send(raisedEvent, msg.header.routingKey);
		logger.log(msg.header.originatorId, LogLevel.info, 'event published', msg);
	}

	public async sendMessage(rabbit: RabbitConfig, originatorId: string, msg: any, routingKey?: string): Promise<void> { // tslint:disable-line:no-any
		await rabbit.connection.completeConfiguration();
		let raisedEvent = new amqp.Message(msg);
		rabbit.exchange.send(raisedEvent, routingKey);
		logger.log(originatorId, LogLevel.info, 'event published', msg);
	}

}
export const basePublisher = new BasePublisher();
