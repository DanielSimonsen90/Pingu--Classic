const { Message, MessageEmbed } = require("discord.js");
const { PinguGuild, PinguLibrary } = require('../../PinguPackage');
const fs = require('fs');

module.exports = {
    name: 'updatepguilds',
    description: 'Updates PinguGuilds in guilds.json with new stuff from PinguPackage.ts',
    usage: '<guild name | guild id | show>',
    example: [`Pingu Support`, '460926327269359626', 'show'],
    id: 4,
    /**@param {Message} message @param {string[]} args*/
    async execute(message, args) {
        const BotGuilds = message.client.guilds.cache.array().sort((a, b) => a.name > b.name ? 1 : -1);
        let arg = args.join(' ').toLowerCase();

        let PinguGuildsArr = [];
        for (var x = 0; x < BotGuilds.length; x++) {
            PinguGuildsArr[x] = new PinguGuild(BotGuilds[x]);
            //PinguLibrary.pGuildLog(message.client, module.exports.name, `Going through all servers - just finished: ${PinguGuildsArr[x].guildName}`);
            if (arg != "show") continue;
            else if (arg != PinguGuildsArr[x].guildName.toLowerCase() || arg != PinguGuildsArr[x].guildID) continue;

            await message.channel.send(new MessageEmbed()
                .setTitle(PinguGuildsArr[x].guildName)
                .setColor(PinguGuildsArr[x].embedColor)
                .setThumbnail(BotGuilds[x].iconURL())
                .setDescription(`ID: ${PinguGuildsArr[x].guildID}`)
                .setFooter(`Owner: ${PinguGuildsArr[x].guildOwner.user} | ${PinguGuildsArr[x].guildOwner.id}`)
                .addField('Prefix', PinguGuildsArr[x].botPrefix)
            );
            WriteFile(message, PinguGuildsArr[i], `./servers/${PinguGuildsArr[i].guildName}.json`);
        }
        //PinguLibrary.pGuildLog(message.client, module.exports.name, 'Going through servers complete!');
    }
}

/**@param {Message} message
 * @param {PinguGuild} pGuild
 * @param {string} path*/
async function WriteFile(message, pGuild, path) {
    try {
        var data = JSON.stringify(pGuild, null, 2);

        fs.writeFile(path, '', err => {
            if (err) PinguLibrary.pGuildLog(message.client, `${module.exports.name}: ${pGuild.guildName}`, `[writeFile]: Failed to write file`, err)
            else fs.appendFile(path, data, err => {
                if (err) {
                    PinguLibrary.pGuildLog(message.client, `${module.exports.name}: ${pGuild.guildName}`, `Error while saving **${pGuild.guildName}**!!`, message.content, err);
                }
                else {
                    PinguLibrary.pGuildLog(message.client, `${module.exports.name}: ${pGuild.guildName}`, `Finished! **${pGuild.guildName}.json** was successfully updated with new PinguGuilds elements.\n`);
                    if (message.content.includes('updatepguilds'))
                        message.react('✅')
                }
            });
        })
    } catch (err) {
        PinguLibrary.pGuildLog(message.client, module.exports.name, `Error while saving **${pGuild.guildName}**!!`, message.content, err);
    }
}