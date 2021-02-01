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
    async execute({ message, args, pGuildClient }) {
        let BotGuilds = message.client.guilds.cache.array().sort((a, b) => a.name > b.name ? 1 : -1);
        let Users = GetUsers(BotGuilds).filter(u => !u.bot).sort((a, b) => a.tag > b.tag ? 1 : -1);

        let arg = args.join(' ').toLowerCase();

        let PinguUsersArr = [];
        for (var i = 0; i < Users.length; i++) {
            PinguUsersArr[i] = new PinguUser(Users[i]);
            let pUser = PinguUsersArr[i];

            if (arg && arg == "show")
                await message.channel.send(new MessageEmbed()
                    .setTitle(pUser.tag)
                    .setColor(pGuildClient && pGuildClient.embedColor || PinguLibrary.DefaultEmbedColor)
                    .setThumbnail(pUser.avatar)
                    .setDescription(`ID: ${pUser.id}`)
                    .setFooter(`Servers shared: ${SharedServersString(pUser.sharedServers.map(pg => pg.name))}`)
                    .addField('Daily Streak', pUser.daily.streak, true)
                    .addField('Last Messaged', pUser.replyPerson && pUser.replyPerson.name | "Unset", true)
                    .addField(`Playlists`, pUser.playlists && pUser.playlists.length || null, true)
                );
            if (arg && arg != "show" && (![pUser.tag.toLowerCase(), pUser.id, `<@${pUser.id}>`, `<@!${pUser.id}>`].includes(arg))) continue;

            try {
                try {
                    await PinguUser.UpdatePUser(message.client, Users[i], this.name,
                        `Successfully updated PinguUser for **${Users[i].tag}**`,
                        `Failed updating PinguUser for **${Users[i].tag}**`
                    );
                } catch (e) {
                    if (e.errmsg.includes('duplicate key error collection'))
                        await PinguUser.WritePUser(message.client, Users[i], this.name,
                            `Successfully created PinguUser for **${Users[i].tag}**`,
                            `Failed creating PinguUser for **${Users[i].tag}**`
                        );
                    else throw e;
                }
                if (message.content.includes('updatepguilds'))
                    message.react('✅');
            } catch (err) {
                PinguLibrary.errorLog(message.client, 'Adding to PinguUsers failed', message.content, err);
            }
            PinguLibrary.consoleLog(message.client, `Finished: ${Users[i].tag}`);
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
/**@param {string[]} sharedServers*/
function SharedServersString(sharedServers) {
    let result = `[${sharedServers.length}]: `;
    for (var i = 0; i < sharedServers.length; i++) {
        if (i == 0) result += sharedServers[i];
        else result += ` • ${sharedServers[i]}`;
    }
    return result;
}