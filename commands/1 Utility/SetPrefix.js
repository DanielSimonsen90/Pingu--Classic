const { Message } = require('discord.js');
const fs = require('fs');
const { PinguGuild } = require('../../PinguPackage');

module.exports = {
    name: 'setprefix',
    description: 'set the prefix of server',
    usage: '<new prefix>',
    id: 1,
    guildOnly: true,
    /**@param {Message} message @param {string[]} args*/
    execute(message, args) {
        const pGuilds = GetPGuilds();
        pGuilds.find(pguild => pguild.guildID == message.guild.id).botPrefix = args[0];

        //Update guilds.json
        UpdateGuildsJSON(pGuilds,
            `Prefix has been changed to \`${args[0]}\`!`,
            `I encountered and error while changing my prefix in ${message.guild.name}:\n\n`
        )
    },
};

/**@returns {PinguGuild[]} */
function GetPGuilds() {
    const pGuilds = require('../../guilds.json');
    return pGuilds;
}
function UpdateGuildsJSON(pGuilds, SuccMsg, ErrMsg) {
    fs.writeFile('guilds.json', '', err => {
        if (err) console.log(err);
        else fs.appendFile('guilds.json', JSON.stringify(pGuilds, null, 2), err => {
            message.client.guilds.cache.find(guild => guild.id == `460926327269359626`).owner.createDM().then(DanhoDM => {
                if (err) DanhoDM.send(ErrMsg + err);
                else message.channel.send(SuccMsg);
            });
        });
    })
}