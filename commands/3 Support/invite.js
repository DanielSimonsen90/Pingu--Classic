const { Message } = require('discord.js');
const { DiscordPermissions } = require('../../PinguPackage');

module.exports = {
    name: 'invite',
    cooldown: 5,
    description: 'Sends link to invite bot to your server',
    usage: '',
    id: 3,
    permissions: [DiscordPermissions.SEND_MESSAGES],
    /**@param {Message} message @param {string[]} args*/
    execute(message, args) {
        let missingPermissions = [
            DiscordPermissions.ADMINISTRATOR,
            DiscordPermissions.VIEW_AUDIT_LOG,
            DiscordPermissions.VIEW_GUILD_INSIGHTS,
            DiscordPermissions.MANAGE_GUILD,
            DiscordPermissions.KICK_MEMBERS,
            DiscordPermissions.BAN_MEMBERS,
            DiscordPermissions.CREATE_INSTANT_INVITE,
            DiscordPermissions.MANAGE_NICKNAMES,
            DiscordPermissions.MANAGE_EMOJIS,
            DiscordPermissions.MANAGE_WEBHOOKS,
            DiscordPermissions.MENTION_EVERYONE,
            DiscordPermissions.STREAM,
            DiscordPermissions.MUTE_MEMBERS,
            DiscordPermissions.MOVE_MEMBERS,
            DiscordPermissions.PRIORITY_SPEAKER
        ]

        const Permissions = 372636752;
        message.channel.send(`https://discord.com/api/oauth2/authorize?client_id=562176550674366464&permissions=${Permissions}&scope=bot`);
    }
}