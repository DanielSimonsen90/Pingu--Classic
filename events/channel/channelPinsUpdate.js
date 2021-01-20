const { Client, DMChannel, GuildChannel } = require("discord.js");
const { PinguLibrary, PinguUser } = require("../../PinguPackage");

module.exports = {
	name: 'events: channelPinsUpdate',
	/**@param {Client} client
	 @param {{ channel: DMChannel | GuildChannel, updateDate: Date }}*/
	execute(client, { channel, updateDate }) {

	}
}