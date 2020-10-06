const { Message, MessageEmbed, GuildMember} = require('discord.js')
module.exports = {
    name: 'whois',
    cooldown: 5,
    description: 'Gets the info of a specified user',
    usage: '<ID> | <Mention>',
    id: 1,
    example: ['245572699894710272', '@Danho#2105'],
    /**@param {Message} message @param {string[]} args*/
    execute(message, args) {
        //Permission check
        const PermCheck = CheckPermissions(message);
        if (PermCheck != "Permission Granted") return message.channel.send(PermCheck);

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
            Promise = args[0] == null ? GuildMember.user : message.client.users.fetch(args[0]);

        //Promise becomes a user
        if (args[0] != null)
            Promise.then(User => {
                if (User != GuildMember.user)
                    return SendNonGuildMessage(message, User);
            });
        HandleGuildMember(message, GuildMember);
    },
};

/**@param {Message} message*/
function CheckPermissions(message) {
    if (message.channel.type !== 'dm') {
        const PermissionCheck = message.channel.permissionsFor(message.client.user),
            PermArr = ["SEND_MESSAGES"], PermArrMsg = ["send messages"];

        for (var Perm = 0; Perm < PermArr.length; Perm++)
            if (!PermissionCheck.has(PermArr[Perm]))
                return `Sorry, ${message.author}. It seems like I don't have the **${PermArrMsg[Perm]}** permission.`;
        return `Permission Granted`;
    }
}
/**@param {Message} message @param {GuildMember} GuildMember*/
function HandleGuildMember(message, GuildMember) {
    var GuildArray = GuildMember.client.guilds.cache.array(),
        SharedServers = GuildArray[0] + `\n`;

    for (var x = 1; x < GuildArray.length; x++)
        SharedServers += GuildArray[x] + `\n`;

    SendGuildMessage(message, GuildMember, SharedServers);
}
/**@param {Message} message @param {GuildMember} GuildMember @param {any} SharedServers*/
function SendGuildMessage(message, GuildMember, SharedServers) {
        const pGuilds = require('../../guilds.json');
        const color = pGuilds.find(pguild => pguild.guildID == message.guild.id).embedColor;

    message.channel.send(new MessageEmbed()
        .setTitle(`"${GuildMember.displayName}" (${GuildMember.user.username})`)
        .setThumbnail(GuildMember.user.avatarURL())
        .setColor(color)
        .addField(`UUID`, GuildMember.id, true)
        .addField(`Created at`, GuildMember.user.createdAt, true)
        .addField("\u200B", "\u200B", true)
        //.addField(`Shared Servers`, SharedServers)
    );
}
/**@param {Discord.Message} message @param {Discord.User} User*/
function SendNonGuildMessage(message, User) {
    let color;
    if (message.channel.type != 'dm') {
        const pGuilds = require('../../guilds.json');
        color = pGuilds.find(pguild => pguild.guildID == message.guild.id).embedColor;
    }
    else color = 15527148;

    message.channel.send(new MessageEmbed()
        .setTitle(User.username)
        .setThumbnail(User.avatarURL)
        .setColor(color)
        .addField(`UUID`, User.id, true)
        .addField(`Created at`, User.createdAt, true)
        .addBlankField(true)
    );
}