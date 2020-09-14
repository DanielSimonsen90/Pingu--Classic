const { Message } = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'setprefix',
    description: 'set the prefix of server',
    usage: '<new prefix>',
    id: 1,
    guildOnly: true,
    /**@param {Message} message @param {string[]} args*/
    execute(message, args) {
        const pGuilds = require('../../guilds.json');
        pGuilds.find(pguild => pguild.guildID == message.guild.id).BotPrefix = args[0];

            //Update guilds.json
            fs.writeFile('guilds.json', '', err => {
                if (err) console.log(err);
                else fs.appendFile('guilds.json', JSON.stringify(pGuilds, null, 2), err => {
                    message.client.guilds.cache.find(guild => guild.id == `460926327269359626`).owner.createDM().then(DanhoDM => {
                        if (err) DanhoDM.send(`I encountered and error while changing my prefix in ${message.guild.name}:\n\n${err}`);
                        else message.channel.send(`Prefix has been changed to \`${args[0]}\`!`);
                    });
                });
            })
    },
};