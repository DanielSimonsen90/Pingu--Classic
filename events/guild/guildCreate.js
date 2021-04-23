const { PinguGuild, PinguLibrary, PinguUser, PinguEvent } = require("PinguPackage");

module.exports = new PinguEvent('guildCreate', null,
    async function execute(client, guild) {
        //Add to MongolDB
        PinguGuild.Write(client, guild, module.exports.name, `${client.user.username} joined "**${guild.name}**", owned by ${guild.owner}`);

        await Promise.all(guild.members.cache.map(async member => {
            if (!await PinguUser.Get(member.user))
                return PinguUser.Write(client, member.user, module.exports.name, `${client.user.name} joined ${guild.name}`);
            return null;
        }));

        if (!guild.owner) return;

        //Thank guild owner for adding Pingu
        let OwnerDM = await guild.owner.user.createDM();
        if (!OwnerDM) return PinguLibrary.errorLog(client, `Unable to create DM to ${guild.owner}!`, null, null, { params: { guild } });

        OwnerDM.send(
            `Hi, ${guild.owner.user}!\n` +
            `I've successfully joined your server, **${guild.name}**!\n\n` +

            `Thank you for adding me!\n` +
            `Use \`*help\`, if you don't know how I work!`
        )
            .catch(err => PinguLibrary.errorLog(client, `Failed to send ${guild.owner} a DM`, null, err, { params: { guild }, additional: { OwnerDM } }))
            .then(PinguLibrary.consoleLog(guild.client, `Sent ${guild.owner.user.tag} my "thank you" message.`));

    }
);