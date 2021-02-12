const { Message, MessageEmbed, GuildMember, User } = require('discord.js');
const { GetColor } = require('../../../events/guild/presenceUpdate');
const { DiscordPermissions, PinguLibrary } = require('PinguPackage');
module.exports = {
    name: 'whois',
    cooldown: 5,
    description: 'Gets the info of a specified user',
    usage: '<ID> | <Mention>',
    guildOnly: true,
    id: 1,
    example: ['245572699894710272', '@Danho#2105'],
    permissions: [DiscordPermissions.SEND_MESSAGES],
    /**@param {{message: Message, args: string[]}}*/
    async execute({ message, args }) {
        //Permission check
        if (args[0] != null) {
            if (args[0].includes('_')) args[0] = args[0].replace('_', ' ');
            if (args[0].includes('!')) args[0] = args[0].replace('!', '');
        }

        //Variables
        var GuildMember = message.guild.members.cache.array().find(gm => [gm.user.username, gm.displayName, gm.user.id].includes(args[0])) ||
                          message.mentions.members.first(), //No arguments provided || No member found
            user = GuildMember ? GuildMember.user : await message.client.users.fetch(args[0]) || message.member;

        //Promise becomes a user
        return args[0] != null && user != (GuildMember && GuildMember.user || true) ?
            await SendNonGuildMessage(message, user) :
            await HandleGuildMember(message, GuildMember);
    },
};

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
        .setColor(GetColor(null, user.presence))
        .addField(`ID`, gm.id, true)
        .addField(`Created at`, gm.user.createdAt, true)
        .addField(`Joined at`, gm.joinedAt, true)
        .addField(`Shared Servers`, SharedServers)
    );
}
/**@param {Message} message 
 * @param {User} user*/
async function SendNonGuildMessage(message, user) {
    return await message.channel.send(new MessageEmbed()
        .setTitle(user.tag)
        .setThumbnail(user.avatarURL())
        .setColor(GetColor(null, user.presence))
        .addField(`ID`, user.id, true)
        .addField(`Created at`, user.createdAt, true)
        .addField("\u200B", "\u200B", true)
    );
}