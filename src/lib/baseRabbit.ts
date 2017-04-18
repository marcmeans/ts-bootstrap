import * as amqp from 'amqp-ts';

export class RabbitConfig {

	public readonly connection: amqp.Connection;
	public readonly exchange: amqp.Exchange;

	constructor(exchangeName: string) {
		this.connection = new amqp.Connection(process.env[`AMQP_${exchangeName.toUpperCase()}_URI`]);
		this.exchange = this.connection.declareExchange(process.env[`${exchangeName.toUpperCase()}_EXCHANGE`], '', { noCreate: true });
	}
}