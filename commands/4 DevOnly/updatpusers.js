const { Message, MessageEmbed, Guild, User, Client } = require("discord.js");
const { PinguLibrary, PinguUser, PinguGuild } = require('../../PinguPackage');
const fs = require('fs');

module.exports = {
    name: 'updatepusers',
    description: 'Updates PinguGuilds in guilds.json with new stuff from PinguPackage.ts',
    usage: '<guild name | guild id | show>',
    example: [`Danho#2105`, '460926327269359626', 'show'],
    id: 4,
    /**@param {Message} message @param {string[]} args*/
    async execute(message, args) {
        let BotGuilds = message.client.guilds.cache.array().sort((a, b) => a.name > b.name ? 1 : -1);
        let Users = GetUsers(BotGuilds).filter(u => !u.bot).sort((a, b) => a.tag > b.tag ? 1 : -1);

        let arg = args.join(' ').toLowerCase();
        let specialCharacters = ["/", "\\", "<", ">"];

        let PinguUsersArr = [];
        for (var i = 0; i < Users.length; i++) {
            PinguUsersArr[i] = new PinguUser(Users[i]);
            //await PinguLibrary.pUserLog(message.client, module.exports.name, `Going through all users - just finished: ${Users[i].tag}`);
            if (arg == "show")
                await message.channel.send(new MessageEmbed()
                    .setTitle(PinguUsersArr[i].tag)
                    .setColor(PinguGuild.GetPGuild(message.guild) && PinguGuild.GetPGuild(message.guild).embedColor || 'BLURPLE')
                    .setThumbnail(BotGuilds[i].iconURL())
                    .setDescription(`ID: ${PinguUsersArr[i].id}`)
                    .setFooter(`Servers shared: ${GetSharedServers(message.client, PinguUsersArr[i])}`)
                    .addField('Daily Streak', PinguUsersArr[i].dailyStreak)
                    .addField('Last Messaged', PinguUsersArr[i].replyPerson.name)
                );
            if (arg && arg != "show" && ![PinguUsersArr[i].tag.toLowerCase(), PinguUsersArr[i].id].includes(arg)) continue;

            let writableName = PinguUsersArr[i].tag;
            for (var i of writableName) {
                if (specialCharacters.includes(i))
                    writableName = writableName.replace(writableName[i], "");
            }

            await WriteFile(message, PinguUsersArr[i], `./users/${writableName}.json`);
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
/**@param {Client} client
 * @param {User} user*/
function GetSharedServers(client, user) {
    let serversCount = 0;
    client.guilds.cache.forEach(g => g.members.cache.forEach(gm => {
        if (gm.user.id == user.id)
            serversCount++;
    }))
    return serversCount;
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
                    PinguLibrary.pUserLog(message.client, `${module.exports.name}: ${pUser.tag}`, `Finished! **${pUser.tag}.json** was successfully updated with new PinguUser elements.\n`);
                    if (message.content.includes('updatepusers'))
                        message.react('✅')
                }
            });
        })
    } catch (err) {
        PinguLibrary.pUserLog(message.client, module.exports.name, `Error while saving **${pUser.tag}**!!`, message.content, err);
    }
}