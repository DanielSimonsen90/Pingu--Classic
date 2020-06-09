const Discord = require('discord.js')
module.exports = {
    name: 'uinfo',
    cooldown: 5,
    description: 'Gets the info of a specified user',
    usage: 'uinfo <ID> | <Mention>',
    execute(message, args) {
        //Permission check
        CheckPermissions(message);

        //Variables
        var GuildMember = message.guild.members.array().find(GuildUser => GuildUser.user.username === args[0]) || //Username
                          message.guild.members.array().find(GuildUser => GuildUser.displayName === args[0]) || //Nickname
                          message.guild.members.find(Member => Member.id == args[0]) ||
                          message.mentions.members.first() || 
                          message.guild.member(message.author), //No arguments provided || No member found
            Promise = args[0] == null ? GuildMember.user : message.client.fetchUser(args[0]);

        //Promise becomes a user
        if (args[0] != null)
            Promise.then(User => {
                if (User != GuildMember.user)
                    SendNonGuildMessage(message, User);
            });
        HandleGuildMember(message, GuildMember);
    },
};

function CheckPermissions(message) {
    if (message.channel.type === 'dm')
        return message.author.send(`I execute this command in DMs.`);
    else {
        const PermissionCheck = message.channel.memberPermissions(message.guild.client.user),
            PermArr = ["SEND_MESSAGES"];
        for (var Perm = 0; Perm < PermArr.length; Perm++)
            if (!PermissionCheck.has(PermArr[Perm]))
                return message.channel.send(`Sorry, ${message.author}. It seems like I don't have the **${PermArr[Perm]}** permission.`);
    }
}

function HandleGuildMember(message, GuildMember) {

    var GuildArray = GuildMember.client.guilds.array(),
        SharedServers = GuildArray[0] + `\n`;

    for (var x = 1; x < GuildArray.length; x++)
        SharedServers += GuildArray[x] + `\n`;

    SendGuildMessage(message, GuildMember, SharedServers);
}

function SendGuildMessage(message, GuildMember, SharedServers) {
    message.channel.send(new Discord.RichEmbed()
        .setTitle(`"${GuildMember.displayName}" (${GuildMember.user.username})`)
        .setThumbnail(GuildMember.user.avatarURL)
        .setColor(0xfb8927)
        .addField(`UUID`, GuildMember.id, true)
        .addField(`Created at`, GuildMember.user.createdAt, true)
        .addBlankField(true)
        .addField(`Shared Servers`, SharedServers)
    );
    return;
}
function SendNonGuildMessage(message, User) {
    message.channel.send(new Discord.RichEmbed()
        .setTitle(User.username)
        .setThumbnail(User.avatarURL)
        .setColor(0xfb8927)
        .addField(`UUID`, User.id, true)
        .addField(`Created at`, User.createdAt, true)
        .addBlankField(true)
    );
    return;
}