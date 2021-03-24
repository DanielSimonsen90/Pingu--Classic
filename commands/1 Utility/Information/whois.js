const { Message, MessageEmbed, GuildMember, User } = require('discord.js');
const { GetColor } = require('../../../events/guild/presenceUpdate');
const { PinguCommand, PinguLibrary, EmbedField } = require('PinguPackage');

module.exports = new PinguCommand('whois', 'Utility', 'Gets the info of specified user', {
    usage: '<ID> | <@Mention>',
    guildOnly: true,
    example: ['245572699894710272', '@Danho#2105']
}, async ({ message, args }) => {
    //Permission check
    if (args[0] != null) {
        if (args[0].includes('_')) args[0] = args[0].replace('_', ' ', );
        if (args[0].includes('!')) args[0] = args[0].replace('!', '');
    }

    //Variables
    var GuildMember = message.guild.members.cache.array().find(gm => [gm.user.username, gm.displayName, gm.user.id].includes(args[0])) ||
        message.mentions.members.first(), //No arguments provided || No member found
        user = GuildMember ? GuildMember.user : !isNaN(parseInt(args[0])) ? await message.client.users.fetch(args[0]) : message.mentions.users.first() || message.author;

    //Promise becomes a user
    return args[0] != null && user != (GuildMember && GuildMember.user || true) ?
        await SendNonGuildMessage(message, user) :
        await HandleGuildMember(message, GuildMember);
});

/**@param {Message} message 
 * @param {GuildMember} GuildMember*/
async function HandleGuildMember(message, GuildMember) {
    let sharedWithClient = await PinguLibrary.getSharedServers(message.client, GuildMember.user);
    let sharedWithAuthor = sharedWithClient
        .filter(guild => guild.members.cache.has(message.author.id))
        .map(g => g.name)
        .join(', ');

    return await SendGuildMessage(message, GuildMember, sharedWithAuthor);
}
/**@param {Message} message 
 * @param {GuildMember} gm 
 * @param {string[]} SharedServers*/
async function SendGuildMessage(message, gm, SharedServers) {
    return await message.channel.send(new MessageEmbed()
        .setTitle(`"${gm.displayName}" (${gm.user.username})`)
        .setThumbnail(gm.user.avatarURL())
        .setColor(GetColor(null, gm.user.presence))
        .addFields([
            new EmbedField(`ID`, gm.id, true),
            new EmbedField(`Created at`, gm.user.createdAt, true),
            new EmbedField(`Joined at`, gm.joinedAt, true),
            new EmbedField(`Shared Servers`, SharedServers)
        ])
    );
}
/**@param {Message} message 
 * @param {User} user*/
async function SendNonGuildMessage(message, user) {
    return await message.channel.send(new MessageEmbed()
        .setTitle(user.tag)
        .setThumbnail(user.avatarURL())
        .setColor(await GetColor(null, user.presence))
        .addFields([
            new EmbedField(`ID`, user.id, true),
            new EmbedField(`Created at`, user.createdAt, true),
            PinguLibrary.BlankEmbedField(true)
        ])
    );
}