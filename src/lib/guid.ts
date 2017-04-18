import * as uuid from 'uuid';

export class Guid {
	public static new(): string {
		return uuid();
	}
}