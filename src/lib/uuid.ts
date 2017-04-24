import * as uuid from 'uuid';

export class Uuid {
	/**
	 * Returns a new UUIDv4
	 */
	public static new(): string {
		return uuid();
	}
}