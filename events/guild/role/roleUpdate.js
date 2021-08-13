const { Guild } = require("discord.js");
const { PinguGuild, PinguEvent, PClient, PinguClient } = require("PinguPackage");

module.exports = {
    ...new PinguEvent('roleUpdate',
        async function setContent(client, embed, previous, current) {
            let description = GetDescription();
            return module.exports.content = description ? 
                embed.setDescription(description)
                    .setTitle(`${module.exports.name} - ${current.name} ${(current.name != previous.name ? `(${previous.name})` : "")}`) : 
                null;

            function GetDescription() {
                if (current.color != previous.color) return PinguEvent.SetDescriptionValues('Color', previous.color, current.color);
                else if (current.hoist != previous.hoist) return PinguEvent.SetDescriptionValues('Hoist', previous.hoist, current.hoist);
                else if (current.mentionable != previous.mentionable) return PinguEvent.SetDescriptionValues('Mentionable', previous.mentionable, current.mentionable);
                else if (current.rawPosition != previous.rawPosition) return PinguEvent.SetDescriptionValues('Position', previous.rawPosition, current.rawPosition);
                else if (current.permissions.toArray().length != previous.permissions.toArray().length) return PinguEvent.GoThroughArrays(
                    'Permissions',
                    previous.permissions.toArray(),
                    current.permissions.toArray(),
                    PinguEvent.SetDescriptionValues
                );
                else if (ChangedPermissions()) return ChangedPermissions();
                else return PinguEvent.UnknownUpdate(previous, current);
            }
            function ChangedPermissions() {
                let roleArr = current.permissions.toArray();
                let preRoleArr = previous.permissions.toArray();
                let added = [], removed = [];

                for (let i = 0; i < roleArr.length; i++) {
                    if (!preRoleArr.includes(roleArr[i])) //Permission added
                        added.push(roleArr[i]);
                }
                for (let i = 0; i < preRoleArr.length; i++) {
                    if (!roleArr.includes(preRoleArr[i])) //Permission removed
                        removed.push(preRoleArr[i]);
                }

                if (!added.length && !removed.length) return null;

                return PinguEvent.SetDescription('Permission', `${(
                    added.length ? `**Added Permissions**\n${added.map(p => `- ${p}`).join(`\n`)}n` : ""
                )}${(
                    removed.length ? `**Removed Permissions**\n${removed.map(p => `- ${p}`).join(`\n`)}n` : ""
                )}`);
            }
        },
        async function execute(client, previous, { guild }) {
            let pGuild = client.pGuilds.get(guild);
            module.exports.CheckRoleChange(client, guild, pGuild, module.exports.name);
        },
    ), ...{
        /**Checks if role color was changed, to update embed colors
         * @param {PinguClient} client
         * @param {Guild} guild
         * @param {PinguGuild} pGuild
         * @param {string} scriptName*/
        CheckRoleChange(client, guild, pGuild, scriptName) {
            //Get the color of the Pingu role in message.guild
            const guildRoleColor = guild.me.roles.cache.find(botRoles => botRoles.managed).color;
            const pGuildClient = client.toPClient(pGuild);

            if (!pGuildClient) pGuildClient = pGuild.clients[(client.isLive ? 0 : 1)] = new PClient(guild.client, guild);

            let clientIndex = pGuild.clients.indexOf(pGuildClient);

            //If color didn't change
            if (guildRoleColor == pGuildClient.embedColor) return;

            //Update pGuildClient.EmbedColor with guild's Pingu role color & put pGuild back into pGuilds
            pGuild.clients[clientIndex].embedColor = guildRoleColor;

            //Save Index of pGuild & log the change
            client.log('console', `[**${guild.name}**]: Embedcolor for **${client.user.username}** updated from ${pGuildClient.embedColor} to ${guildRoleColor}`);

            //Update Pingu Guild
            client.pGuilds.update(pGuild, scriptName, `Role color from **${guild.name}**`)
        }
    }
};