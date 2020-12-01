const { Message, Guild, MessageEmbed } = require("discord.js");
const { PinguGuild, PinguLibrary } = require('../../PinguPackage');
const fs = require('fs');

module.exports = {
    name: 'updatepguilds',
    cooldown: 5,
    description: 'Updates PinguGuilds in guilds.json with new stuff from PinguPackage.ts',
    usage: '',
    id: 4,
    /**@param {Message} message @param {string[]} args*/
    execute(message, args) {
        const BotGuilds = message.client.guilds.cache.array();
        let PinguGuilds = [];
        for (var x = 0; x < BotGuilds.length; x++) {
            PinguGuilds[x] = SetGuild(BotGuilds[x]);
            PinguLibrary.pGuildLog(message.client, module.exports.name, `Going through all servers - just finished: ${PinguGuilds[x].guildName}`);
            //message.channel.send(new MessageEmbed()
            //    .setTitle(PinguGuilds[x].guildName)
            //    .setColor(PinguGuilds[x].EmbedColor)
            //    .setThumbnail(BotGuilds[x].iconURL())
            //    .addField('Prefix', PinguGuilds[x].BotPrefix)
            //);
        }
        PinguLibrary.pGuildLog(message.client, module.exports.name, 'Going through servers complete!\nSaving to guilds.json...');
        try {
            var data = JSON.stringify(PinguGuilds, null, 2);
            fs.writeFile('guilds.json', '', err => {
                if (err) PinguLibrary.pGuildLog(message.client, module.exports.name, `[writeFile]: Failed to write file`, err)
                else fs.appendFile('guilds.json', data, err => {
                    if (err) {
                        PinguLibrary.pGuildLog(message.client, module.exports.name, `Error while saving to guilds.json!!`, message.content, err);
                    }
                    else {
                        PinguLibrary.pGuildLog(message.client, module.exports.name, 'Finished! guilds.json was successfully updated with new PinguGuilds elements.\n');
                        if (message.content.includes('updatepguilds'))
                            message.react('✅')
                    }
                });
            })
        } catch (err) {
            PinguLibrary.pGuildLog(message.client, module.exports.name, `Error while saving to guilds.json!!`, message.content, err);
        }
    }
}
/**@param {Guild} guild*/
function SetGuild(guild) {
    const pGuild = new PinguGuild(guild);
    pGuild.embedColor = guild.member(guild.client.user).roles.cache.find(role => role.name.includes('Pingu')).color;
    return pGuild;
}