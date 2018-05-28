"use strict";

const Database = require("../adapters/Database");
const Models = require("../models");
const { MoleculerError } = require("moleculer").Errors;

module.exports = {
	name: "users",

	settings: {
 		state: {

 		}
	},

	actions: {

		//	call "users.create" --email "e-mail" --lastname "Last Name" --firstname "First Name" --channel 0
		create: {
			params: {
				email: "string",
				lastname: "string",
				firstname: "string",
				channel: "string"
			},
			handler(ctx) {
				var user = new Models.User(ctx.params).create();
				console.log("users - create - ", user);
				if (user) {
					return Database()
						.then((db) => {
							var allUsers = db.get("users");

							// if(allUsers.find({ "email": user.email }).value()) {
							// 	throw new MoleculerError("users", 409, "ERR_CRITICAL", { code: 409, message: "User already exists."} )
							// }
							return allUsers
								.push(user)
								.write()
								.then(() => {
									return user;
								})
								.catch(() => {
									throw new MoleculerError("users", 500, "ERR_CRITICAL", { code: 500, message: "Critical error." } )
								});
					});
				} else {
					throw new MoleculerError("users", 417, "ERR_CRITICAL", { code: 417, message: "User is not valid." } )
				}
			}
		},

	}
};
