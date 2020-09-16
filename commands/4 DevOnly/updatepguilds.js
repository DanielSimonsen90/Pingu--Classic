const { Message, Guild, MessageEmbed } = require("discord.js");
const { PinguGuild } = require('../../PinguPackage');
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
            console.log(`Going through all servers - just finished: ${PinguGuilds[x].guildName}`);
            //message.channel.send(new MessageEmbed()
            //    .setTitle(PinguGuilds[x].guildName)
            //    .setColor(PinguGuilds[x].EmbedColor)
            //    .setThumbnail(BotGuilds[x].iconURL())
            //    .addField('Prefix', PinguGuilds[x].BotPrefix)
            //);
        }
        console.log('Going through servers complete!\nSaving to guilds.json...');
        try {
            var data = JSON.stringify(PinguGuilds, null, 2);
            fs.writeFile('guilds.json', '', err => {
                if (err) console.log(err);
                else fs.appendFile('guilds.json', data, err => {
                    if (err) console.log(`ERROR while saving to guilds.json:\n${err}`);
                    else {
                        console.log('Finihsed! guilds.json was successfully updated with new PinguGuilds elements.\n');
                        if (message.content.includes('updatepguilds'))
                            message.react('✅')
                    }
                });
            })
        } catch (error) { message.channel.send('Try/Catch error: ' + error); }
    }
}
/**@param {Guild} guild*/
function SetGuild(guild) {
    const pGuild = new PinguGuild(guild);
    pGuild.embedColor = guild.member(guild.client.user).roles.cache.find(role => role.name.includes('Pingu')).color;
    return pGuild;
}