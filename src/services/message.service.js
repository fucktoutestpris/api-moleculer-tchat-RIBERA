"use strict";

const Database = require("../adapters/Database");
const Models = require("../models");
const { MoleculerError } = require("moleculer").Errors;

module.exports = {
	name: "message",

	settings: {
 		state: {

 		}
	},

	actions: {

		//	call "message.create" --message "Messages" --firstname "First Name" --channel "channel"
		create: {
			params: {
				message: "string",
				firstname: "string",
				channel: "string",
			},
			handler(ctx) {
				var mess = new Models.Message(ctx.params).create();
				console.log("message - create - ", mess);
				if (mess) {
					return Database()
						.then((db) => {
							var allMess = db.get("message");
							return allMess
								.push(mess)
								.write()
								.then(() => {
									return mess;
								})
								.catch(() => {
									throw new MoleculerError("message", 500, "ERR_CRITICAL", { code: 500, message: "Critical error." } )
								});
					});
				} else {
					throw new MoleculerError("message", 417, "ERR_CRITICAL", { code: 417, message: "message is not valid." } )
				}
			}
		},

		getAll: {
			params: {

			},
			handler(ctx) {
				return Database()
					.then((db) => {
						return db.get("message").value();
					});
			}
		},

		getChannel: {
			params: {
				channel: "string"
			},
			handler(ctx) {
						return Database()
							.then((db) => {
								var mess = db.get("message").filter({ channel: ctx.params.channel }).value();
								return mess;
							})
							.catch(() => {
								throw new MoleculerError("message", 500, "ERR_CRITICAL", { code: 500, message: "Critical error." } )
							});
			}
				
			
		},


	}
};
