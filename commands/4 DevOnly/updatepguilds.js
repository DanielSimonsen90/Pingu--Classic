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
                    .setColor((PinguGuildsArr[i].clients[0] || PinguGuildsArr[i].clients[1]) &&
                        (PinguGuildsArr[i].clients[0].embedColor || PinguGuildsArr[i].clients[1].embedColor))
                    .setThumbnail(BotGuilds[i].iconURL())
                    .setDescription(`ID: ${PinguGuildsArr[i].id}`)
                    .setFooter(`Owner: ${PinguGuildsArr[i].guildOwner.user} | ${PinguGuildsArr[i].guildOwner.id}`)
                    .addField('Prefix', (PinguGuildsArr[i].clients[0] || PinguGuildsArr[i].clients[1]) &&
                        (PinguGuildsArr[i].clients[0].prefix || PinguGuildsArr[i].clients[1].prefix)));
            if (arg && arg != "show" && ![PinguGuildsArr[i].name.toLowerCase(), PinguGuildsArr[i].id].includes(arg)) continue;

            try {
                if (!await PinguGuild.GetPGuild(BotGuilds[i])) await PinguGuild.WritePGuild(message.client, BotGuilds[i], this.name,
                    `Successfully created PinguGuild for **${BotGuilds[i].name}**`,
                    `Failed creating PinguGuild for **${BotGuilds[i].name}**`
                );
                else await PinguGuild.UpdatePGuild(message.client, BotGuilds[i], this.name,
                    `Successfully updated PinguGuild for **${BotGuilds[i].name}**`,
                    `Failed updating PinguGuild for **${BotGuilds[i].name}**`
                );
                if (message.content.includes('updatepguilds'))
                    message.react('✅');
            } catch (err) {
                PinguLibrary.errorLog(message.client, 'Adding to PinguGuilds failed', message.content, err);
            }
        }
        //PinguLibrary.pGuildLog(message.client, module.exports.name, 'Going through servers complete!');
    }
}