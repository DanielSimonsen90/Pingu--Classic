const { Client, Guild } = require("discord.js");
const { PinguGuild, PinguLibrary, PinguUser } = require("../../PinguPackage");

module.exports = {
    name: 'events: guildCreate',
    /**@param {Client} client
     * @param {{guild: Guild}}*/
    async execute(client, { guild }) {
        //Add to MongolDB
        PinguGuild.WritePGuild(client, guild, module.exports.name,
            `Successfully joined "**${guild.name}**", owned by ${guild.owner}`,
            `Something went wrong when joining "**${guild.name}**" (${guild.id})!`
        );

        guild.members.cache.forEach(async member => {
            if (!await PinguUser.GetPUser(member.user)) {
                PinguUser.WritePUser(client, member.user, module.exports.name,
                    `Added **${member.user.tag}** to MongoDB`,
                    `Failed to add **${member.user.tag}** to MongoDB`
                );
            }
        })

        if (!guild.owner) return;

        //Thank guild owner for adding Pingu
        let OwnerDM = await guild.owner.user.createDM();
        if (!OwnerDM) return PinguLibrary.errorLog(client, `Unable to create DM to ${guild.owner}!`);

        OwnerDM.send(
            `Hi, ${guild.owner.user}!\n` +
            `I've successfully joined your server, **${guild.name}**!\n\n` +

            `Thank you for adding me!\n` +
            `Use \`*help\`, if you don't know how I work!`
        )
            .catch(err => PinguLibrary.errorLog(client, `Failed to send ${guild.owner} a DM`, null, err))
            .then(PinguLibrary.consoleLog(guild.client, `Sent ${guild.owner.user.tag} my "thank you" message.`));

    }
}