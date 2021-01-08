const { Client, Guild } = require("discord.js");
const { PinguGuild, PinguLibrary } = require("../../PinguPackage");

module.exports = {
    name: 'events: guildUpdate',
    /**@param {Client} client
     * @param {{from: Guild, to: Guild}}*/
    execute(client, { from, to }) {
        try {
            if (from.name != to.name) throw { message: 'Cannot find module' };
            PinguGuild.UpdatePGuildJSON(client, to, this.name,
                `Successfully updated **${to.name}**'s ${(from.name != to.name ? `(${from.name}) ` : "")}Pingu Guild.`,
                `Unable to update **${to.name}**'s ${(from.name != to.name ? `(${from.name})` : "")} Pingu Guild.`
            );
        }
        catch (err) {
            if (err.message.includes('Cannot find module'))
                return PinguGuild.DeletePGuild(from, pFGuild => PinguGuild.WritePGuild(to, pTGuild => PinguLibrary.pGuildLog(client,
                    this.name, `Renamed **${pFGuild.name}**'s pGuild name to **${pTGuild.name}**.`)));

            PinguLibrary.errorLog(client, "Unable to update pGuild", null, err);
        }
    }
}