const { Client, Guild, CategoryChannel } = require("discord.js");
const { PinguGuild, PinguLibrary, PinguUser } = require("../../PinguPackage");

module.exports = {
    name: 'events: guildCreate',
    /**@param {Client} client
     * @param {{guild: Guild}}*/
    async execute(client, { guild }) {
        PinguGuild.WritePGuild(guild, async pGuild => await PinguLibrary.pGuildLog(client, this.name, `Successfully joined "**${pGuild.name}**", owned by <@${pGuild.guildOwner.id}>`));

        //Thank guild owner for adding Pingu
        let OwnerDM = await guild.owner.user.createDM();
        if (!OwnerDM) return PinguLibrary.errorLog(client, `Unable to create DM to ${guild.owner}!`);

        OwnerDM.send(
            `Hi, ${guild.owner.user}!\n` +
            `I've successfully joined your server, "**${guild.name}**"!\n\n` +

            `Thank you for adding me!\n` +
            `Use \`*help\`, if you don't know how I work!`
        )
            .catch(err => PinguLibrary.errorLog(client, `Failed to send ${guild.owner} a DM`, null, err))
            .then(PinguLibrary.consoleLog(guild.client, `Sent ${guild.owner.user.tag} my "thank you" message.`));

        guild.members.cache.forEach(member => {
            if (!PinguUser.GetPUser(member.user)) {
                PinguUser.WritePUser(member.user, async pUser => await PinguLibrary.pUserLog(client, this.name, `Created **${pUser.tag}.json**`))
            }
        })
    }
}