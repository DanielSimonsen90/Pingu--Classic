const { Client, Role, Guild } = require("discord.js");
const { PinguGuild, PinguLibrary } = require("../../../PinguPackage");

module.exports = {
    name: 'events: roleUpdate',
    /**@param {Client} client
     @param {{preRole: Role, role: Role}}*/
    execute(client, { preRole, role }) {
        let guild = role.guild;
        let pGuild = PinguGuild.GetPGuild(guild);
        this.CheckRoleChange(guild, pGuild);
    },
    /**Checks if role color was changed, to update embed colors
     * @param {Guild} guild
    * @param {PinguGuild} pGuild*/
    CheckRoleChange(guild, pGuild) {
        //Get the color of the Pingu role in message.guild
        const guildRoleColor = guild.me.roles.cache.find(botRoles => botRoles.managed).color;

        //If color didn't change
        if (guildRoleColor == pGuild.embedColor) return;

        //Update pGuild.EmbedColor with guild's Pingu role color & put pGuild back into pGuilds
        pGuild.embedColor = guildRoleColor;

        //Save Index of pGuild & log the change
        PinguLibrary.consoleLog(client, `[${guild.name}]: Embedcolor updated from ${pGuild.embedColor} to ${guildRoleColor}`);

        //Update guilds.json
        PinguGuild.UpdatePGuildJSON(client, guild, `${this.name}: CheckRoleChange`,
            `Successfully updated role color from "${guild.name}"`,
            `I encountered and error while updating my role color in "${guild.name}"`
        );
    }
}

