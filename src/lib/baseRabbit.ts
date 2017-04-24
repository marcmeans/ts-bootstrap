import * as amqp from 'amqp-ts';

export class RabbitConfig {

	public readonly connection: amqp.Connection;
	public readonly exchange: amqp.Exchange;

	/**
	 * Creates a configuration object to wrap connection and exchange
	 * Requires AMQP_{domain.toUpperCase()}_URI and ${domain.toUpperCase()}_EXCHANGE
	 * to be added to the env file
	 * @param domain for the connection and exchange
	 */
	constructor(domain: string) {
		this.connection = new amqp.Connection(process.env[`AMQP_${domain.toUpperCase()}_URI`]);
		this.exchange = this.connection.declareExchange(process.env[`${domain.toUpperCase()}_EXCHANGE`], '', { noCreate: true });
	}
}