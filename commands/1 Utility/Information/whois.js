const { Message, MessageEmbed, GuildMember, User } = require('discord.js');
const { GetColor } = require('../../../events/guild/presenceUpdate');
const { PinguCommand, EmbedField, PinguClient } = require('PinguPackage');

module.exports = new PinguCommand('whois', 'Utility', 'Gets the info of specified user', {
    usage: '<ID> | <@Mention> | <username>',
    example: ['245572699894710272', '@Danho#2105', 'John Smith']
}, async ({ message, args }) => {
    //Permission check
    if (args[0]) {
        args[0] = args[0].replace(/!/, '').replace(/_+/, ' ');
    }

    let search = args.join(' ');

    //Variables
    var member = GetMember(message, search);
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
function GetMember(message, search) {
    return [
        message.guild?.members.cache.find(gm => [gm.user.username, gm.nickname, gm.user.id].includes(search)),
        message.mentions.members?.first()
    ].filter(v => v)[0];
}
/**@param {Message} message
 * @param {GuildMember} member
 * @param {string} search*/
async function GetUser(message, member, search) {
    return (await Promise.all([
        member?.user,
        message.client.users.cache.find(u => [u.username, u.id].includes(search)),
        !isNaN(search) && search.match(/\d{18}/g) && message.client.users.fetch(search),
        search.match(/<@\d{18}>/g) && message.client.users.fetch(search.substring(2, search.length - 1)),
        search.match(/<@\??\d{18}>/g) && message.client.users.fetch(search.substring(3, search.length - 1))
    ])).filter(v => v)[0];
}

/**@param {Message} message 
 * @param {GuildMember} member*/
async function HandleGuildMember(message, member) {
    const { client } = message;
    const sharedWithClient = client.getSharedServers(member.user);
    const sharedWithAuthor = sharedWithClient
        .filter(guild => guild.members.cache.has(message.author.id))
        .map(g => `- ${g.name}`)
        .join('\n');

    return SendGuildMessage(message, member, sharedWithAuthor);
}
/**@param {Message} message 
 * @param {GuildMember} gm 
 * @param {string[]} SharedServers*/
async function SendGuildMessage(message, gm, SharedServers) {
    const { client } = message;
    const badges = await client.getBadges(gm.user);

    // const embed = new MessageEmbed({
    //     title: `${gm.displayName}${(gm.displayName != gm.user.username ? ` (${gm.user.username})` : ``)}`,
    //     thumbnail: { url: gm.user.avatarURL() },
    //     color: GetColor(null, gm.user.presence),
    //     fields: [
    //         new EmbedField(`Created at`, `<t:${Math.round(gm.user.createdTimestamp / 1000)}:R>`, true),
    //         new EmbedField(`Joined at`, `<t:${Math.round(gm.joinedTimestamp / 1000)}:R>`, true),
    //         EmbedField.Blank(true),
    //         new EmbedField(`Shared Servers`, SharedServers, true),
    //         badges?.size ? new EmbedField(`Badges`, badges.map(badge => badge.emoji).join(' '), true) : EmbedField.Blank(true),
    //         EmbedField.Blank(true)
    //     ],
    //     footer: { text: `ID: ${gm.id}` }
    // });

    const embed = new MessageEmbed()
        .setTitle(`${gm.displayName}${(gm.displayName != gm.user.username ? ` (${gm.user.username})` : ``)}`)
        .setThumbnail(gm.user.avatarURL())
        .setColor(GetColor(null, gm.user.presence))
        .addFields([
            new EmbedField(`Created at`, `<t:${Math.round(gm.user.createdTimestamp / 1000)}:R>`, true),
            new EmbedField(`Joined at`, `<t:${Math.round(gm.joinedTimestamp / 1000)}:R>`, true),
            EmbedField.Blank(true),
            new EmbedField(`Shared Servers`, SharedServers, true),
            badges?.size ? new EmbedField(`Badges`, badges.map(badge => badge.emoji).join(' '), true) : EmbedField.Blank(true),
            EmbedField.Blank(true)
        ])
        .setFooter(`ID: ${gm.id}`)

    return message.channel.sendEmbeds(embed);
}
/**@param {Message} message 
 * @param {User} user*/
async function SendNonGuildMessage(message, user) {
    const { client } = message;

    if (!user.id && !isNaN(user))
        user = client.users.cache.get(user);

    const badges = client.getBadges(user);
    return message.channel.sendEmbeds(new MessageEmbed({
        title: user.tag,
        thumbnail: { url: user.avatarURL() },
        color: GetColor(null, user.presence),
        fields: [
            new EmbedField(`Created at`, `<t:${Math.round(user.createdTimestamp / 1000)}:R>`, true),
            EmbedField.Blank(true),
            EmbedField.Blank(true),
            badges?.array().length ? new EmbedField(`Badges`, badges.map(badge => badge.emoji).join(' '), true) : EmbedField.Blank(true),
            EmbedField.Blank(true),
        ],
        footer: { text: `ID: ${user.id}` }
    }));
}