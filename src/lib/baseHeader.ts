export interface IBaseHeader {
	originatorId: string;
	originatorHeader: any; // tslint:disable-line:no-any
	customerUUID: string;
	routingKey: string;
	eventDateTime: Date;
	tripId: string;
}