import * as amqp from 'amqp-ts';
import { RabbitConfig } from './baseRabbit';
import { logger, LogLevel } from './logger';

export class BasePublisher {

	/**
	 * Sends message to configured rabbit exchange
	 * @param rabbit configured RabbitConfig
	 * @param msg Message to send to the exchange
	 */
	public async send(rabbit: RabbitConfig, msg: any): Promise<void> {	// tslint:disable-line:no-any
		await rabbit.connection.completeConfiguration();
		let raisedEvent = new amqp.Message(msg);
		rabbit.exchange.send(raisedEvent, msg.header.routingKey);
		logger.log(LogLevel.info, 'event published', msg);
	}

}
export const basePublisher = new BasePublisher();
