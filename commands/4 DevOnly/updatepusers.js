const { Message, MessageEmbed, Guild, User } = require("discord.js");
const { PinguLibrary, PinguUser, PinguGuild } = require('../../PinguPackage');
const fs = require('fs');

module.exports = {
    name: 'updatepusers',
    description: 'Updates PinguUsers to /users/ with new stuff from PinguPackage.ts',
    usage: '<user tag | user id | show>',
    example: [`Danho#2105`, '460926327269359626', 'show'],
    id: 4,
    /**@param {{message: Message, args: string[]}}*/
    async execute({ message, args }) {
        let BotGuilds = message.client.guilds.cache.array().sort((a, b) => a.name > b.name ? 1 : -1);
        let Users = GetUsers(BotGuilds).filter(u => !u.bot).sort((a, b) => a.tag > b.tag ? 1 : -1);

        let arg = args.join(' ').toLowerCase();

        let PinguUsersArr = [];
        for (var i = 0; i < Users.length; i++) {
            PinguUsersArr[i] = new PinguUser(Users[i], message.client);
            let pUser = PinguUsersArr[i];

            if (arg == "show")
                await message.channel.send(new MessageEmbed()
                    .setTitle(pUser.tag)
                    .setColor(PinguGuild.GetPGuild(message.guild) && PinguGuild.GetPGuild(message.guild).embedColor || 'BLURPLE')
                    .setThumbnail(pUser.avatar)
                    .setDescription(`ID: ${pUser.id}`)
                    .setFooter(`Servers shared: ${SharedServersString(pUser.sharedServers.map(pg => pg.name))}`)
                    .addField('Daily Streak', pUser.daily.streak, true)
                    .addField('Last Messaged', pUser.replyPerson && pUser.replyPerson.name | "Unset", true)
                    .addField(`Playlists`, pUser.playlists && pUser.playlists.length || null, true)
                );
            if (arg && arg != "show" && (![pUser.tag.toLowerCase(), pUser.id, `<@${pUser.id}>`, `<@!${pUser.id}>`].includes(arg))) continue;

            await WriteFile(message, PinguUsersArr[i], `./users/${PinguUser.PUserFileName(Users[i])}.json`);
            PinguLibrary.consoleLog(message.client, `Finished: ${Users[i].tag}`);
            //await PinguLibrary.pUserLog(message.client, module.exports.name, `Going through all users - just finished: ${Users[i].tag}`);
        }
        PinguLibrary.pUserLog(message.client, module.exports.name, 'Going through users complete!');
    }
}

/**@param {Guild[]} BotGuilds
 @returns {User[]}*/
function GetUsers(BotGuilds) {
    let users = [];
    BotGuilds.forEach(guild => {
        guild.members.cache.forEach(member => {
            if (!users.includes(member.user))
                users.push(member.user);
        });
    });
    return users;
}
/**@param {Message} message
 * @param {PinguUser} pUser
 * @param {string} path*/
async function WriteFile(message, pUser, path) {
    try {
        var data = JSON.stringify(pUser, null, 2);

        fs.writeFile(path, '', err => {
            if (err) PinguLibrary.pUserLog(message.client, `${module.exports.name}: ${pUser.tag}`, `[writeFile]: Failed to write file`, err)
            else fs.appendFile(path, data, err => {
                if (err) {
                    PinguLibrary.pUserLog(message.client, `${module.exports.name}: ${pUser.tag}`, `Error while saving **${pUser.tag}**!!`, message.content, err);
                }
                else {
                    //PinguLibrary.pUserLog(message.client, `${module.exports.name}: ${pUser.tag}`, `Finished! **${pUser.tag}.json** was successfully updated with new PinguUser elements.\n`);
                    if (message.content.includes('updatepusers'))
                        message.react('✅')
                }
            });
        })
    } catch (err) {
        PinguLibrary.pUserLog(message.client, module.exports.name, `Error while saving **${pUser.tag}**!!`, message.content, err);
    }
}
/**@param {string[]} sharedServers*/
function SharedServersString(sharedServers) {
    let result = `[${sharedServers.length}]: `;
    for (var i = 0; i < sharedServers.length; i++) {
        if (i == 0) result += sharedServers[i];
        else result += ` • ${sharedServers[i]}`;
    }
    return result;
}