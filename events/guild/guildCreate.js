const { MessageEmbed, Guild } = require("discord.js");
const { PinguClient, PinguEvent } = require("PinguPackage");
/**@param {PinguClient} client
 * @param {Guild} guild*/
const joinString = (client, guild) => `${client} joined **${guild}**, owned by ${guild.owner}`

module.exports = new PinguEvent('guildCreate', 
    async function setContent(client, guild) {
        return module.exports.content = new MessageEmbed({ description: joinString(guild.client, guild) }) 
    },
    async function execute(client, guild) {
        const pGuild = client.pGuilds.get(guild);
        if (!pGuild) await client.pGuilds.add(guild, module.exports.name, joinString(client, guild));

        if (!guild.owner) return;

        //Thank guild owner for adding Pingu
        let ownerDM = await guild.owner.user.createDM();
        if (!ownerDM) return client.log('error', `Unable to create DM to ${guild.owner}!`, null, null, { params: { guild } });

        try {
            await ownerDM.send(
                `Hi, ${guild.owner.user}!\n` +
                `I've successfully joined your server, **${guild}**!\n\n` +
    
                `Thank you for adding me!\n` +
                `Use \`${client.DefaultPrefix}help\`, if you don't know how I work!`
            );
            client.log('console', `Sent ${guild.owner.user.tag} my "thank you" message.`)
        } catch (err) {
            client.log('error', `Failed to send ${guild.owner} a DM`, null, err, { params: { guild }, additional: { OwnerDM: ownerDM } })
        }
    }
);