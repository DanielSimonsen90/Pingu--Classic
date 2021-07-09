const { Message, MessageEmbed, GuildMember, User } = require('discord.js');
const { GetColor } = require('../../../events/guild/presenceUpdate');
const { PinguCommand, PinguLibrary, EmbedField } = require('PinguPackage');

module.exports = new PinguCommand('whois', 'Utility', 'Gets the info of specified user', {
    usage: '<ID> | <@Mention> | <username>',
    example: ['245572699894710272', '@Danho#2105', 'John Smith']
}, async ({ message, args }) => {
    //Permission check
    if (args[0] != null) {
        if (args[0].includes('_')) args[0] = args[0].replace('_', ' ',);
        if (args[0].includes('!')) args[0] = args[0].replace('!', '');
    }

    let search = args.join(' ');

    //Variables
    var member = await GetMember(message, search);
    var user = await GetUser(message, member, search) || message.author;

    if (user == message.author)
        member = message.member;

    //Promise becomes a user
    return search != null && user != (member?.user || true) ?
        SendNonGuildMessage(message, user) :
        HandleGuildMember(message, member || message.member);
});

/**@param {Message} message
 * @param {string} search*/
async function GetMember(message, search) {
    const options = [
        message.guild?.members.cache.array().find(gm => [gm.user.username, gm.nickname, gm.user.id].includes(search)),
        message.mentions.members?.first()
    ];

    let result = "";
    for (var i = 0; i < options.length; i++) {
        result = options[i];
        if (result) return result;
    }
    return null;
}
/**@param {Message} message
 * @param {GuildMember} member
 * @param {string} search*/
async function GetUser(message, member, search) {
    const options = [
        member && member.user,
        message.client.users.cache.array().find(u => [u.username, u.id].includes(search)),
        !isNaN(search) && search.match(/\d{18}/g) && message.client.users.fetch(search),
        search.match(/<@\d{18}>/g) && message.client.users.fetch(search.substring(2, search.length - 1)),
        search.match(/<@\??\d{18}>/g) && message.client.users.fetch(search.substring(3, search.length - 1))
    ];

    let result = "";
    for (var i = 0; i < options.length; i++) {
        result = await options[i];
        if (result) return result;
    }
    return null;
}

/**@param {Message} message 
 * @param {GuildMember} member*/
async function HandleGuildMember(message, member) {
    let sharedWithClient = await PinguLibrary.getSharedServers(message.client, member.user);
    let sharedWithAuthor = sharedWithClient
        .filter(guild => guild.members.cache.has(message.author.id))
        .map(g => `- ${g.name}`)
        .join('\n');

    return await SendGuildMessage(message, member, sharedWithAuthor);
}
/**@param {Message} message 
 * @param {GuildMember} gm 
 * @param {string[]} SharedServers*/
async function SendGuildMessage(message, gm, SharedServers) {
    let badges = await PinguLibrary.getBadges(gm.user);

    return await message.channel.send(new MessageEmbed()
        .setTitle(`${gm.displayName} ${(gm.displayName != gm.user.username ? `(${gm.user.username})` : ``)}`)
        .setThumbnail(gm.user.avatarURL())
        .setColor(await GetColor(null, gm.user.presence))
        .addFields([
            new EmbedField(`Created at`, gm.user.createdAt, true),
            new EmbedField(`Joined at`, gm.joinedAt, true),
            EmbedField.Blank(true),
            new EmbedField(`Shared Servers`, SharedServers, true),
            badges && badges.array().length ? new EmbedField(`Badges`, badges.map(badge => badge.emoji).join(' '), true) : EmbedField.Blank(true),
            EmbedField.Blank(true)
        ])
        .setFooter(`ID: ${gm.id}`)
    );
}
/**@param {Message} message 
 * @param {User} user*/
async function SendNonGuildMessage(message, user) {
    if (!user.id && !isNaN(user))
        user = message.client.users.cache.get(user);

    let badges = await PinguLibrary.getBadges(user);
    return await message.channel.send(new MessageEmbed()
        .setTitle(user.tag)
        .setThumbnail(user.avatarURL())
        .setColor(await GetColor(null, user.presence))
        .addFields([
            new EmbedField(`Created at`, user.createdAt, true),
            EmbedField.Blank(true),
            EmbedField.Blank(true),
            badges && badges.array().length ? new EmbedField(`Badges`, badges.map(badge => badge.emoji).join(' '), true) : EmbedField.Blank(true),
            EmbedField.Blank(true),
        ])
        .setFooter(`ID: ${user.id}`)
    );
}