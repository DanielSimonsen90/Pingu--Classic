const { Client, Role, Guild, MessageEmbed } = require("discord.js");
const { PinguGuild, PinguLibrary, PinguEvents } = require("../../../PinguPackage");

module.exports = {
    name: 'events: roleUpdate',
    /**@param {{preRole: Role, role: Role}}*/
    setContent({ preRole, role }) {
        return module.exports.content = new MessageEmbed().setDescription(GetDescription());

        function GetDescription() {
            if (role.color != preRole.color) return PinguEvents.SetDescriptionValues('Color', preRole.color, role.color);
            else if (role.hoist != preRole.hoist) return PinguEvents.SetDescriptionValues('Hoist', preRole.hoist, role.hoist);
            else if (role.mentionable != preRole.mentionable) return PinguEvents.SetDescriptionValues('Mentionable', preRole.mentionable, role.mentionable);
            else if (role.position != preRole.position) return PinguEvents.SetDescriptionValues('Position', preRole.position, role.position);
            else if (role.permissions.toArray().length != preRole.permissions.toArray().length) return PinguEvents.GoThroughArrays(
                'Permissions',
                preRole.permissions.toArray(),
                role.permissions.toArray(),
                PinguEvents.SetDescriptionValues
            );
            else if (ChangedPermissions()) return ChangedPermissions();
            else return PinguEvents.UnknownUpdate(preRole, role);
        }

        function ChangedPermissions() {
            let roleArr = role.permissions.toArray();
            let preRoleArr = preRole.permissions.toArray();
            let added = [], removed = [];

            for (let i = 0; i < roleArr.length; i++) {
                if (!preRoleArr.includes(roleArr[i])) //Permission added
                    added.push(roleArr[i]);
            }
            for (let i = 0; i < preRoleArr.length; i++) {
                if (!roleArr.includes(preRoleArr[i])) //Permission removed
                    removed.push(preRoleArr[i]);
            }

            if (added.length == 0 && removed.length == 0) return null;

            return PinguEvents.SetDescription('Permission', `${(
                added.length > 0 ? `**Added Permissions**\n${added.map(p => `• ${p}`).join(`\n`)}n` : ""
            )}${(
                removed.length > 0 ? `**Removed Permissions**\n${removed.map(p => `• ${p}`).join(`\n`)}n` : ""
            )}`);
        }
    },
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

