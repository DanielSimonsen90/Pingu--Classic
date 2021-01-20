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
                return PinguGuild.UpdatePGuild(preGuild, guild, _ =>
                    PinguLibrary.pGuildLog(client, this.name,
                        `Renamed **${preGuild.name}**'s Pingu Guild name to **${guild.name}**.`)
                )
            }

            PinguLibrary.errorLog(client, "Unable to update Pingu Guild", null, err);
        }
    }
}