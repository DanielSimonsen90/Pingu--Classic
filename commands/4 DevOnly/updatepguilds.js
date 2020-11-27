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
            PinguLibrary.errorLog(message.client, `Going through all servers - just finished: ${PinguGuilds[x].guildName}`);
            //message.channel.send(new MessageEmbed()
            //    .setTitle(PinguGuilds[x].guildName)
            //    .setColor(PinguGuilds[x].EmbedColor)
            //    .setThumbnail(BotGuilds[x].iconURL())
            //    .addField('Prefix', PinguGuilds[x].BotPrefix)
            //);
        }
        PinguLibrary.errorLog(message.client, 'Going through servers complete!\nSaving to guilds.json...');
        try {
            var data = JSON.stringify(PinguGuilds, null, 2);
            fs.writeFile('guilds.json', '', err => {
                if (err) console.log(err);
                else fs.appendFile('guilds.json', data, err => {
                    if (err) {
                        PinguLibrary.DanhoDM(message.client, `Error while saving to guilds.json!!`, message.content, err);
                        PinguLibrary.errorLog(message.client, `Error while saving to guilds.json!! <@245572699894710272>`, message.content, err);
                    }
                    else {
                        PinguLibrary.errorLog(message.client, 'Finished! guilds.json was successfully updated with new PinguGuilds elements.\n');
                        if (message.content.includes('updatepguilds'))
                            message.react('✅')
                    }
                });
            })
        } catch (err) {
            PinguLibrary.DanhoDM(message.client, `Error while saving to guilds.json!!`, message.content, err);
            PinguLibrary.errorLog(message.client, `Error while saving to guilds.json!! <@245572699894710272>`, message.content, err);
        }
    }
}
/**@param {Guild} guild*/
function SetGuild(guild) {
    const pGuild = new PinguGuild(guild);
    pGuild.embedColor = guild.member(guild.client.user).roles.cache.find(role => role.name.includes('Pingu')).color;
    return pGuild;
}