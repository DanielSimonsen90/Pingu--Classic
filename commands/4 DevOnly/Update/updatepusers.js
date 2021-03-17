const { MessageEmbed, Guild, User } = require("discord.js");
const { PinguCommand, PinguLibrary, PinguClient, PinguUser, EmbedField, UserAchievementConfig, PinguUserSchema } = require('PinguPackage');

module.exports = new PinguCommand('updatepusers', 'DevOnly', `Creates new PinguUsers to MongoDB, if they weren't added already`, {
    usage: '<user tag | user id | show>',
    example: [`Danho#2105`, '460926327269359626', 'show']
}, async ({ client, message, args, pGuildClient }) => {
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
                .setColor(pGuildClient && pGuildClient.embedColor || PinguClient.ToPinguClient(message.client).DefaultEmbedColor)
                .setThumbnail(pUser.avatar)
                .setDescription(`ID: ${pUser._id}`)
                .addFields([
                    new EmbedField('Daily Streak', pUser.daily.streak, true),
                    new EmbedField('Last Messaged', pUser.replyPerson && pUser.replyPerson.name | "Unset", true),
                    new EmbedField(`Playlists`, pUser.playlists && pUser.playlists.length || null, true)
                ]).setFooter(`Servers shared: ${SharedServersString(pUser.sharedServers.map(pg => pg.name))}`)
            );
        if (arg && arg != "show" && (![pUser.tag.toLowerCase(), pUser._id, `<@${pUser._id}>`, `<@!${pUser._id}>`].includes(arg))) continue;

        try {
            var awaitedPUser = await PinguUser.GetPUser(Users[i]);
            if (!awaitedPUser)
                await PinguUser.WritePUser(message.client, Users[i], module.exports.name,
                    `Successfully created PinguUser for **${Users[i].tag}**`,
                    `Failed creating PinguUser for **${Users[i].tag}**`
                );
            else {
                await PinguUserSchema.updateMany({}, { $set: { achievementConfig: new UserAchievementConfig('DM') } }).exec();
            }
        } catch (err) {
            PinguLibrary.errorLog(message.client, `Adding to PinguUsers failed`, message.content, err, {
                params: { message, args, pGuildClient },
                additional: { arg, Users, user: Users[i], pUser },
                trycatch: { awaitedPUser }
            });
        }
    }

    PinguLibrary.pUserLog(message.client, module.exports.name, 'Going through users complete!');

    if (message.content.includes('updatepusers'))
        message.react('✅');
});

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