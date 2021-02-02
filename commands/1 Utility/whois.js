const { Message, MessageEmbed, GuildMember } = require('discord.js');
const { PinguGuild, DiscordPermissions, PinguLibrary } = require('../../PinguPackage');
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
                          message.mentions.members.first() || message.guild.member(message.author), //No arguments provided || No member found
            user = GuildMember ? GuildMember.user : await message.client.users.fetch(args[0]);

        //Promise becomes a user
        return args[0] != null && user != GuildMember.user ?
            await SendNonGuildMessage(message, user) :
            await HandleGuildMember(message, GuildMember);
    },
};

/**@param {Message} message 
 * @param {GuildMember} GuildMember*/
async function HandleGuildMember(message, GuildMember) {
    let sharedWithClient = PinguLibrary.getSharedServers(message.client, GuildMember.user);
    let sharedWithAuthor = sharedWithClient.filter(guild => guild.members.cache.has(message.author.id));

    return await SendGuildMessage(message, GuildMember, sharedWithAuthor.map(guild => guild.name).join(', '));
}
/**@param {Message} message 
 * @param {GuildMember} GuildMember 
 * @param {string[]} SharedServers*/
async function SendGuildMessage(message, GuildMember, SharedServers) {
    return await message.channel.send(new MessageEmbed()
        .setTitle(`"${GuildMember.displayName}" (${GuildMember.user.username})`)
        .setThumbnail(GuildMember.user.avatarURL())
        .setColor((message.channel.type != 'dm' ? PinguGuild.GetPClient(message.client, pGuild).embedColor : PinguLibrary.DefaultEmbedColor))
        .addField(`ID`, GuildMember.id, true)
        .addField(`Created at`, GuildMember.user.createdAt, true)
        .addField("\u200B", "\u200B", true)
        .addField(`Shared Servers`, SharedServers)
    );
}
/**@param {Message} message 
 * @param {User} User*/
async function SendNonGuildMessage(message, User) {
    let pGuild = await PinguGuild.GetPGuild(message.guild);

    return await message.channel.send(new MessageEmbed()
        .setTitle(User.username)
        .setThumbnail(User.avatarURL)
        .setColor((message.channel.type != 'dm' ? PinguGuild.GetPClient(message.client, pGuild).embedColor : PinguLibrary.DefaultEmbedColor))
        .addField(`ID`, User.id, true)
        .addField(`Created at`, User.createdAt, true)
        .addBlankField(true)
    );
}