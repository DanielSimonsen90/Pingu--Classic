const { Message, MessageEmbed, GuildMember, Permissions} = require('discord.js');
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
        var GuildMember = message.guild.members.cache.array().find(GuildUser => GuildUser.user.username === args[0]) || //Username
                          message.guild.members.cache.array().find(GuildUser => GuildUser.displayName === args[0]) || //Nickname
                          message.guild.members.cache.find(Member => Member.id == args[0]) ||
                          message.mentions.members.first() || 
                          message.guild.member(message.author), //No arguments provided || No member found
            user = GuildMember ? GuildMember.user : await message.client.users.fetch(args[0]);

        //Promise becomes a user
        if (args[0] != null)
            if (user != GuildMember.user)
                return SendNonGuildMessage(message, user);
        HandleGuildMember(message, GuildMember);
    },
};

/**@param {Message} message @param {GuildMember} GuildMember*/
function HandleGuildMember(message, GuildMember) {
    let sharedWithClient = PinguLibrary.getSharedServers(message.client, GuildMember.user);
    let sharedWithAuthor = sharedWithClient.filter(guild => guild.members.cache.has(message.author.id));

    SendGuildMessage(message, GuildMember, sharedWithAuthor.map(guild => guild.name).join(', '));
}
/**@param {Message} message @param {GuildMember} GuildMember @param {any} SharedServers*/
function SendGuildMessage(message, GuildMember, SharedServers) {
    const color = PinguGuild.GetPGuild(message.guild).embedColor;

    message.channel.send(new MessageEmbed()
        .setTitle(`"${GuildMember.displayName}" (${GuildMember.user.username})`)
        .setThumbnail(GuildMember.user.avatarURL())
        .setColor(color)
        .addField(`UUID`, GuildMember.id, true)
        .addField(`Created at`, GuildMember.user.createdAt, true)
        .addField("\u200B", "\u200B", true)
        .addField(`Shared Servers`, SharedServers)
    );
}
/**@param {Discord.Message} message @param {Discord.User} User*/
function SendNonGuildMessage(message, User) {
    let color = message.channel.type != 'dm' ? PinguGuild.GetPGuild(message.guild).embedColor : 15527148;

    message.channel.send(new MessageEmbed()
        .setTitle(User.username)
        .setThumbnail(User.avatarURL)
        .setColor(color)
        .addField(`UUID`, User.id, true)
        .addField(`Created at`, User.createdAt, true)
        .addBlankField(true)
    );
}