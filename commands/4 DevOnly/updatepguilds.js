const { Message, MessageEmbed } = require("discord.js");
const { PinguGuild, PinguLibrary } = require('../../PinguPackage');
const fs = require('fs');

module.exports = {
    name: 'updatepguilds',
    description: 'Updates PinguGuilds to /servers/ with new stuff from PinguPackage.ts',
    usage: '<guild name | guild id | show>',
    example: [`Pingu Support`, '460926327269359626', 'show'],
    id: 4,
    /**@param {{message: Message, args: string[]}}*/
    async execute({ message, args }) {
        const BotGuilds = message.client.guilds.cache.array().sort((a, b) => a.name > b.name ? 1 : -1);
        let arg = args.join(' ').toLowerCase();

        let PinguGuildsArr = [];
        for (var i = 0; i < BotGuilds.length; i++) {
            PinguGuildsArr[i] = new PinguGuild(BotGuilds[i]);
            //PinguLibrary.pGuildLog(message.client, module.exports.name, `Going through all servers - just finished: ${PinguGuildsArr[x].guildName}`);
            if (arg == "show")
                await message.channel.send(new MessageEmbed()
                    .setTitle(PinguGuildsArr[i].name)
                    .setColor(PinguGuildsArr[i].embedColor)
                    .setThumbnail(BotGuilds[i].iconURL())
                    .setDescription(`ID: ${PinguGuildsArr[i].id}`)
                    .setFooter(`Owner: ${PinguGuildsArr[i].guildOwner.user} | ${PinguGuildsArr[i].guildOwner.id}`)
                    .addField('Prefix', PinguGuildsArr[i].botPrefix));
            if (arg && arg != "show" && ![PinguGuildsArr[i].name.toLowerCase(), PinguGuildsArr[i].id].includes(arg)) continue;

            WriteFile(message, PinguGuildsArr[i], `./servers/${PinguGuildsArr[i].name}.json`);
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
            if (err) PinguLibrary.pGuildLog(message.client, `${module.exports.name}: ${pGuild.name}`, `[writeFile]: Failed to write file`, err)
            else fs.appendFile(path, data, err => {
                if (err) {
                    PinguLibrary.pGuildLog(message.client, `${module.exports.name}: ${pGuild.name}`, `Error while saving **${pGuild.name}**!!`, message.content, err);
                }
                else {
                    PinguLibrary.pGuildLog(message.client, `${module.exports.name}: ${pGuild.name}`, `Finished! **${pGuild.name}.json** was successfully updated with new PinguGuilds elements.\n`);
                    if (message.content.includes('updatepguilds'))
                        message.react('✅')
                }
            });
        })
    } catch (err) {
        PinguLibrary.pGuildLog(message.client, module.exports.name, `Error while saving **${pGuild.name}**!!`, message.content, err);
    }
}