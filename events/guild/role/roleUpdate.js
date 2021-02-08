const { Client, Role, Guild, MessageEmbed } = require("discord.js");
const { PinguGuild, PinguLibrary, PinguEvents, PClient } = require("../../../PinguPackage");

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
    async execute(client, { preRole, role }) {
        let guild = role.guild;
        let pGuild = await PinguGuild.GetPGuild(guild);
        this.CheckRoleChange(guild, pGuild, this.name);
    },
    /**Checks if role color was changed, to update embed colors
     * @param {Guild} guild
     * @param {PinguGuild} pGuild
     * @param {string} scriptName*/
    CheckRoleChange(guild, pGuild, scriptName) {
        let { client } = guild;

        //Get the color of the Pingu role in message.guild
        const guildRoleColor = guild.me.roles.cache.find(botRoles => botRoles.managed).color;
        const pGuildClient = PinguGuild.GetPClient(client, pGuild);

        if (!pGuildClient) pGuildClient = pGuild.clients[(guild.client.user.id == PinguLibrary.Clients.PinguID ? 0 : 1)] = new PClient(guild.client, guild);

        let clientIndex = pGuild.clients.indexOf(pGuildClient);

        //If color didn't change
        if (guildRoleColor == pGuildClient.embedColor) return;

        //Update pGuildClient.EmbedColor with guild's Pingu role color & put pGuild back into pGuilds
        pGuild.clients[clientIndex].embedColor = guildRoleColor;

        //Save Index of pGuild & log the change
        PinguLibrary.consoleLog(guild.client, `[**${guild.name}**]: Embedcolor for **${client.user.username}** updated from ${pGuildClient.embedColor} to ${guildRoleColor}`);

        //Update Pingu Guild
        PinguGuild.UpdatePGuild(client, {clients: pGuild.clients}, pGuild, scriptName,
            `Successfully updated role color from **${guild.name}**`,
            `I encountered and error while updating my role color in **${guild.name}**`
        );
    }
}

