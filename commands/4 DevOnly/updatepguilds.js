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
    async execute(message, args) {
        const BotGuilds = message.client.guilds.cache.array().sort((a, b) => a.name > b.name ? 1 : -1);

        let PinguGuildsArr = [];
        for (var x = 0; x < BotGuilds.length; x++) {
            PinguGuildsArr[x] = new PinguGuild(BotGuilds[x]);
            //PinguLibrary.pGuildLog(message.client, module.exports.name, `Going through all servers - just finished: ${PinguGuildsArr[x].guildName}`);
            //message.channel.send(new MessageEmbed()
            //    .setTitle(PinguGuilds[x].guildName)
            //    .setColor(PinguGuilds[x].EmbedColor)
            //    .setThumbnail(BotGuilds[x].iconURL())
            //    .addField('Prefix', PinguGuilds[x].BotPrefix)
            //);
        }
        PinguLibrary.pGuildLog(message.client, module.exports.name, 'Going through servers complete!\nSaving to guilds.json...');

        for (var i = 0; i < PinguGuildsArr.length; i++) {
            let pGuild = PinguGuildsArr[i];
            let path = `./servers/${pGuild.guildName}.json`;

            WriteFile(pGuild, path);
        }
    }
}

/**@param {PinguGuild} pGuild
 * @param {string} path*/
async function WriteFile(pGuild, path) {
    try {
        var data = JSON.stringify(pGuild, null, 2);

        fs.writeFile(path, '', err => {
            if (err) PinguLibrary.pGuildLog(message.client, `${module.exports.name}: ${pGuild.guildName}`, `[writeFile]: Failed to write file`, err)
            else fs.appendFile(path, data, err => {
                if (err) {
                    PinguLibrary.pGuildLog(message.client, `${module.exports.name}: ${pGuild.guildName}`, `Error while saving to guilds.json!!`, message.content, err);
                }
                //else {
                //    PinguLibrary.pGuildLog(message.client, `${module.exports.name}: ${pGuild.guildName}`, `Finished! **${pGuild.guildName}.json** was successfully updated with new PinguGuilds elements.\n`);
                //    if (message.content.includes('updatepguilds'))
                //        message.react('✅')
                //}
            });
        })
    } catch (err) {
        PinguLibrary.pGuildLog(message.client, module.exports.name, `Error while saving to guilds.json!!`, message.content, err);
    }
}