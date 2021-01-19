const { Client, Guild } = require("discord.js");
const { PinguGuild, PinguLibrary } = require("../../PinguPackage");

module.exports = {
    name: 'events: guildUpdate',
    /**@param {Client} client
     * @param {{preGuild: Guild, guild: Guild}}*/
    execute(client, { preGuild, guild }) {
        try {
            if (preGuild.name != guild.name) throw { message: 'Cannot find module' };
            PinguGuild.UpdatePGuildJSON(client, guild, this.name,
                `Successfully updated **${guild.name}**'s ${(preGuild.name != guild.name ? `(${preGuild.name}) ` : "")}Pingu Guild.`,
                `Unable to update **${guild.name}**'s ${(preGuild.name != guild.name ? `(${preGuild.name})` : "")} Pingu Guild.`
            );
        }
        catch (err) {
            if (err.message.includes('Cannot find module')) {
                return;
                return PinguGuild.DeletePGuild(preGuild, pFGuild => PinguGuild.WritePGuild(guild, pTGuild => PinguLibrary.pGuildLog(client,
                    this.name, `Renamed **${pFGuild.name}**'s pGuild name to **${pTGuild.name}**.`)));
            }

            PinguLibrary.errorLog(client, "Unable to update pGuild", null, err);
        }
    }
}