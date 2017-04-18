import * as express from 'express';
import * as jwt from 'jwt-simple';
import { logger, LogLevel } from './logger';
import request = require('request-promise');

let jwtSecret = process.env.JWT_SECRET || 'foo';
export interface ICustomRequest extends express.Request {
	authenticatedUser: any; // tslint:disable-line:no-any
}

export class Validation {

	public async validateToken(token: string): Promise<string> {
		if (token) {
			token = token.substring(4, token.length);

			try {
				let decoded = jwt.decode(token, jwtSecret);
				return decoded.sub;
			}
			catch (err) {
				throw 'Unauthorized';
			}
		}
		else {
			throw 'Unauthorized';
		}
	}

	// tslint:disable-next-line:no-any
	public async validateExistingPermissions(actions: string[], permissions: any[], originatorId: string): Promise<boolean> {

		try {
			let isaction: boolean = false;

			if (actions.length > 0) {
				let mergedactions = [];
				for (let permit of permissions) {
					for (let p of permit.actions) {
						mergedactions.push(p.action);
					}
				}
				for (let m of mergedactions) {
					for (let a of actions) {
						if (a === m) {
							isaction = true;
						}
					}
				}

				if (isaction) {
					logger.log(originatorId, LogLevel.trace, 'Permissions valid');
					return true;
				}
				else {
					logger.log(originatorId, LogLevel.trace, 'Permissions do not match with the action');
					return false;
				}
			}
			else {
				logger.log(originatorId, LogLevel.trace, 'No actions for api auth request');
				return true;
			}
		} catch (err) {
			logger.log(originatorId, LogLevel.trace, 'getPermissions returned status: ' + err);
			return false;
		}

	}

	public async getUsernameFromToken(token: string, originatorId: string): Promise<string> {
		if (token) {
			token = token.substring(4, token.length);

			try {
				let decoded = jwt.decode(token, jwtSecret);
				let username = decoded.sub;
				logger.log(originatorId, LogLevel.trace, `Decoded Username : ${username}`);
				return username;
			}
			catch (err) {
				return null;
			}
		}
		else {
			return null;
		}
	}

	public async validatePermissions(req: express.Request, actions: string[], originatorId: string): Promise<boolean> {
		let authReq = {
			url: `${process.env.TSB_SESSION_API_URL}/permissions`,
			json: true,
			headers: { Authorization: req.get('authorization'), originatorId: req.get('originatorId') }
		};

		try {
			let permissions = await request.get(authReq);
			let result = await this.validateExistingPermissions(actions, permissions, originatorId);
			return result;
		} catch (err) {
			logger.log(originatorId, LogLevel.debug, 'getPermissions returned status', err);
			return false;
		}

	}

}
export const validation = new Validation();

